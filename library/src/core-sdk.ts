import { RequestManager, toBigNumber, HTTPProvider } from "eth-connect";
import { getProvider } from "@decentraland/web3-provider";
import { EthConnectAdapter } from "@bosonprotocol/eth-connect-sdk";
import { CoreSDK, EnvironmentType, MetaTxConfig, subgraph } from "@bosonprotocol/core-sdk";
import { getUserAccount } from "@decentraland/EthereumController";
import { Delay } from "./ecs-utils-clone/delay";

let httpRM: RequestManager;

export const ADDRESS_ZERO=`0x0000000000000000000000000000000000000000`;

export async function initCoreSdk(envName: EnvironmentType, providerUrl: string, metaTx?: Partial<MetaTxConfig>): Promise<CoreSDK> {
  const signer = await getProvider();
  const metamaskRM = new RequestManager(signer);
  const provider: HTTPProvider = new HTTPProvider(providerUrl);
  httpRM = new RequestManager(provider);
  const ethConnectAdapter = new EthConnectAdapter(httpRM, {getSignerAddress: getUserAccount, delay}, metamaskRM);
  const coreSDK = CoreSDK.fromDefaultConfig({
    envName,
    web3Lib: ethConnectAdapter,
    metaTx
  });
  return coreSDK;
}

async function delay(ms: number): Promise<undefined> {
  return new Promise((resolve, reject) => {
    const ent = new Entity()
    engine.addEntity(ent)
    ent.addComponent(
      new Delay(ms, () => {
        resolve()
        engine.removeEntity(ent)
      })
    )
  })
}

export async function getBalance(address: string) {
  if (!httpRM) {
    throw "no http requestManager";
  }
  return httpRM.eth_getBalance(address, "latest");
}

export function checkOfferCommittable(coreSDK: CoreSDK, offer: subgraph.OfferFieldsFragment): {
  isCommittable: boolean;
  voided: boolean;
  notYetValid: boolean;
  expired: boolean;
  soldOut: boolean;
} {
  const targetDate = Math.floor(Date.now() / 1000)
  const voided = offer.voided;
  const notYetValid = parseInt(offer.validFromDate) > targetDate;
  const expired = parseInt(offer.validUntilDate) < targetDate;
  const soldOut = parseInt(offer.quantityAvailable) === 0;
  return {
    isCommittable: !voided && !notYetValid && !expired && !soldOut,
    voided,
    notYetValid,
    expired,
    soldOut
  }
}

export async function checkUserCanCommitToOffer(coreSDK: CoreSDK, offer: subgraph.OfferFieldsFragment, userAccount: string): Promise<{ canCommit: boolean, approveNeeded?: boolean }> {
  const exchangeTokenAddress = offer.exchangeToken.address;
  const nativeOffer = exchangeTokenAddress === ADDRESS_ZERO;
  const balance = nativeOffer ? await getBalance(userAccount) : await coreSDK.erc20BalanceOf({
    contractAddress: exchangeTokenAddress,
    owner: userAccount
  });
  log("Balance: ", balance.toString(), offer.exchangeToken.symbol);
  if (toBigNumber(balance).lt(offer.price)) {
    return {
      canCommit: false
    };
  }
  if (nativeOffer) {
    return { 
      canCommit: true,
      approveNeeded: false
    };
  }
  log("getProtocolAllowance()", exchangeTokenAddress, offer.price);
  const currentAllowance = await coreSDK.getProtocolAllowance(
    exchangeTokenAddress
  );
  const approveNeeded = toBigNumber(currentAllowance).lt(offer.price);
  log("approveNeeded", approveNeeded);
  return { 
    canCommit: true,
    approveNeeded
  };
}

export async function commitToOffer(coreSDK: CoreSDK, offer: subgraph.OfferFieldsFragment, userAccount: string) {
  const exchangeTokenAddress = offer.exchangeToken.address;
  const nativeOffer = exchangeTokenAddress === ADDRESS_ZERO;
  const canUseMetaTx = coreSDK.isMetaTxConfigSet;
  const { canCommit, approveNeeded } = await checkUserCanCommitToOffer(coreSDK, offer, userAccount);
  if (!canCommit) {
    log("Insufficient balance to commit to this offer");
  } else {
    let txResponse;
    if (nativeOffer) {
      log(`Offer ${offer.id} is using native currency --> meta-transaction is not possible`);
    } else if (!canUseMetaTx) {
      log("Meta-transaction is not configured for Boson Protocol --> meta-transaction is not possible")
    }
    if (!nativeOffer && canUseMetaTx) {
      if (approveNeeded) {
        let approveTx;
        if (coreSDK.checkMetaTxConfigSet({ contractAddress: exchangeTokenAddress })) {
          // Use meta-transaction for approval, if needed
          log("signNativeMetaTxApproveExchangeToken()", exchangeTokenAddress);
          const { r, s, v, functionName, functionSignature } =
            await coreSDK.signNativeMetaTxApproveExchangeToken(
              exchangeTokenAddress,
              offer.price
            );
          log("relayNativeMetaTransaction()", exchangeTokenAddress, functionSignature);
          approveTx = await coreSDK.relayNativeMetaTransaction(
            exchangeTokenAddress,
            {
              functionSignature,
              sigR: r,
              sigS: s,
              sigV: v
            }
          )
        } else {
          log(`Meta-transaction is not configured for token ${offer.exchangeToken.name}'`);
          approveTx = await coreSDK.approveExchangeToken(
            exchangeTokenAddress,
            offer.price
          );
        }
        await approveTx.wait();
      }
      log("signMetaTxCommitToOffer()", offer.id);
      const nonce = Date.now();
      const { r, s, v, functionName, functionSignature } =
        await coreSDK.signMetaTxCommitToOffer({
          offerId: offer.id,
          nonce
        }
      );
      txResponse = await coreSDK.relayMetaTransaction(
        {
          functionName,
          functionSignature,
          sigR: r,
          sigS: s,
          sigV: v,
          nonce
        }
      );
    } else {
      txResponse = await coreSDK.commitToOffer(offer.id, {
        buyer: userAccount,
      });
    }
    log("commitToOffer - txResponse", txResponse);
    const txReceipt = await txResponse.wait();
    log("commitToOffer - txReceipt", txReceipt);
  }
}