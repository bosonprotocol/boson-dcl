import {
  RequestManager,
  toBigNumber,
  HTTPProvider,
  ContractFactory,
} from "eth-connect";
import { getProvider } from "@decentraland/web3-provider";
import { EthConnectAdapter } from "@bosonprotocol/eth-connect-sdk";
import {
  CoreSDK,
  EnvironmentType,
  ConfigId,
  subgraph,
  getEnvConfigById,
} from "@bosonprotocol/core-sdk";
import { Delay } from "./ecs-utils-clone/delay";
import {
  BosonConfigs,
  BosonConfiguration,
  Token,
  processBiconomyConfig,
} from "./config";
import { abis } from "@bosonprotocol/common";
import { hasNft as helperHasNft, NFTType } from "./nft-helper";
import request, { gql, Variables } from "graphql-request";
import { TransactionReceipt } from "@bosonprotocol/common";
import { getUserData } from "@decentraland/Identity";

let httpRM: RequestManager;
let tokensList: Token[] | undefined;
let specifiedEnvName: EnvironmentType;
let specifiedConfigId: ConfigId;
let specifiedInventory: string[];
/**
 * @public
 */
export const ADDRESS_ZERO = `0x0000000000000000000000000000000000000000`;

/**
 * @public
 */
export async function initCoreSdk(
  envName: EnvironmentType,
  configId: ConfigId,
  bosonConfigs: BosonConfigs,
  getUserAccount: () => Promise<string>,
  inventory: string[]
): Promise<CoreSDK> {
  if (!bosonConfigs[envName]) {
    throw `Missing BOSON configuration for target environment ${envName}`;
  }
  const providerUrl = bosonConfigs[envName]!.providerUrl;
  const metaTx = processBiconomyConfig(
    envName,
    configId,
    bosonConfigs[envName]!.biconomy!
  );

  const signer = await getProvider();
  const metamaskRM = new RequestManager(signer);
  const provider: HTTPProvider = new HTTPProvider(providerUrl);
  httpRM = new RequestManager(provider);
  // TODO: tokensList should be passed in configuration, independently from biconomy config
  tokensList = bosonConfigs[envName]?.biconomy?.apiIds.tokens;
  specifiedEnvName = envName;
  specifiedConfigId = configId;
  specifiedInventory = inventory;
  const ethConnectAdapter = new EthConnectAdapter(
    httpRM,
    { getSignerAddress: getUserAccount, delay },
    metamaskRM
  );
  const coreSDK = CoreSDK.fromDefaultConfig({
    envName,
    configId,
    web3Lib: ethConnectAdapter,
    metaTx,
  });
  return coreSDK;
}

/**
 * @public
 */
export async function initCoreSdk2(
  bosonConfiguration: BosonConfiguration,
  _tokensList: Token[] | undefined,
  inventory: string[]
): Promise<CoreSDK> {
  const { envName, configId, biconomy, providerUrl } = bosonConfiguration;
  const coreSdkConfig = getEnvConfigById(envName, configId);
  if (!coreSdkConfig) {
    throw new Error(
      `Invalid coreSDK configuration (envName: ${envName}, configId: ${configId})`
    );
  }
  const metaTx = biconomy
    ? processBiconomyConfig(envName, configId, biconomy)
    : undefined;

  const signer = await getProvider();
  const metamaskRM = new RequestManager(signer);
  const chainId = await metamaskRM.net_version();
  if (!metaTx && chainId !== String(coreSdkConfig.chainId)) {
    throw new Error(
      `Wallet must be connected to chainId ${coreSdkConfig.chainId} (current: ${chainId}), or meta-transactions should be activated for this chain`
    );
  }

  const provider: HTTPProvider = new HTTPProvider(providerUrl);
  httpRM = new RequestManager(provider);
  tokensList = _tokensList;
  specifiedEnvName = envName;
  specifiedConfigId = configId;
  specifiedInventory = inventory;
  const ethConnectAdapter = new EthConnectAdapter(
    httpRM,
    {
      getSignerAddress: getWalletAddress,
      delay,
    },
    metamaskRM
  );
  const coreSDK = CoreSDK.fromDefaultConfig({
    envName,
    configId,
    web3Lib: ethConnectAdapter,
    metaTx,
  });
  return coreSDK;
}

async function getWalletAddress(): Promise<string> {
  return await getUserData()
    .then((userAccount) => {
      return userAccount?.publicKey || (userAccount?.userId as string);
    })
    .catch((error) => {
      log(error);
      return "";
    });
}

async function delay(ms: number): Promise<undefined> {
  return new Promise((resolve /*, reject*/) => {
    const ent = new Entity();
    engine.addEntity(ent);
    ent.addComponent(
      new Delay(ms, () => {
        resolve();
        engine.removeEntity(ent);
      })
    );
  });
}

/**
 * @public
 */
export async function getBalance(address: string) {
  if (!httpRM) {
    throw "no http requestManager";
  }
  return httpRM.eth_getBalance(address, "latest");
}

/**
 * @public
 */
export async function getBalanceDecimalised(address: string) {
  const rtn = await getBalance(address);
  return rtn.toNumber() / Math.pow(10, 18);
}

/**
 * @public
 */
export async function getBalanceByCurrency(
  token: Token,
  walletAddress: string
) {
  if (!httpRM) {
    throw "no http requestManager";
  }

  const factory = new ContractFactory(httpRM, abis.ERC20ABI);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!token) {
    return 0;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contract = (await factory.at(token.address)) as any;
  const decimals: number = await contract.decimals();
  let rtn: number = await contract.balanceOf(walletAddress);
  rtn = rtn / Math.pow(10, decimals);
  return rtn;
}

/**
 * @public
 */
export async function getAllBalances(walletAddress: string): Promise<object> {
  if (!tokensList) {
    throw "missing tokensList";
  }
  const rtn: { [id: string]: number } = {};

  const promises = tokensList.map(async (token) => {
    let thisBalance = 0;

    thisBalance = await getBalanceByCurrency(token, walletAddress);
    return { id: token.name, balance: thisBalance };
  });

  const balances = await Promise.all(promises);
  const maticBalance = await getBalanceDecimalised(walletAddress);
  rtn["matic"] = maticBalance;
  for (let i = 0; i < balances.length; i++) {
    const currentBalanceObj: { id: string; balance: number } = balances[i];
    rtn[currentBalanceObj["id"]] = currentBalanceObj["balance"];
  }

  return rtn;
}

/**
 * @public
 */
export async function hasNft(
  walletAddress: string,
  contractId: string,
  tokenId: string,
  nftType: string
): Promise<number> {
  if (!httpRM) {
    throw "no http requestManager";
  }
  const rtn: number = await helperHasNft(
    walletAddress,
    contractId,
    tokenId,
    NFTType[nftType as keyof typeof NFTType],
    httpRM,
    specifiedInventory
  );
  return rtn;
}

/**
 * @public
 */
export async function checkOfferCommittable(
  coreSDK: CoreSDK,
  offer: subgraph.OfferFieldsFragment
): Promise<{
  isCommittable: boolean;
  voided: boolean;
  notYetValid: boolean;
  expired: boolean;
  soldOut: boolean;
  missingSellerDeposit: boolean;
}> {
  const targetDate = Math.floor(Date.now() / 1000);
  const voided = offer.voided;
  const notYetValid = parseInt(offer.validFromDate) > targetDate;
  const expired = parseInt(offer.validUntilDate) < targetDate;
  const soldOut = parseInt(offer.quantityAvailable) === 0;
  log(
    "Seller deposit needed:",
    offer.sellerDeposit,
    offer.exchangeToken.symbol
  );
  const sellerFunds = (
    await coreSDK.getFunds({
      fundsFilter: {
        account: offer.seller.id,
        token: offer.exchangeToken.address,
      },
    })
  )[0];
  log("sellerFunds", sellerFunds);
  const availableSellerFunds = sellerFunds?.availableAmount || "0";
  const missingSellerDeposit = toBigNumber(offer.sellerDeposit).gt(
    availableSellerFunds
  );
  return {
    isCommittable:
      !voided && !notYetValid && !expired && !soldOut && !missingSellerDeposit,
    voided,
    notYetValid,
    expired,
    soldOut,
    missingSellerDeposit,
  };
}

/**
 * @public
 */
export async function checkUserCanCommitToOffer(
  coreSDK: CoreSDK,
  offer: subgraph.OfferFieldsFragment,
  userAccount: string
): Promise<{ canCommit: boolean; approveNeeded?: boolean }> {
  const exchangeTokenAddress = offer.exchangeToken.address;
  const nativeOffer = exchangeTokenAddress === ADDRESS_ZERO;
  const balance = nativeOffer
    ? await getBalance(userAccount)
    : await coreSDK.erc20BalanceOf({
        contractAddress: exchangeTokenAddress,
        owner: userAccount,
      });
  log("Balance: ", balance.toString(), offer.exchangeToken.symbol);
  if (toBigNumber(balance).lt(offer.price)) {
    return {
      canCommit: false,
    };
  }
  if (nativeOffer) {
    return {
      canCommit: true,
      approveNeeded: false,
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
    approveNeeded,
  };
}

/**
 * @public
 */
export async function commitToOffer(
  coreSDK: CoreSDK,
  offer: subgraph.OfferFieldsFragment,
  userAccount: string
): Promise<TransactionReceipt | undefined> {
  const exchangeTokenAddress = offer.exchangeToken.address;
  const nativeOffer = exchangeTokenAddress === ADDRESS_ZERO;
  const canUseMetaTx = coreSDK.isMetaTxConfigSet;
  const { canCommit, approveNeeded } = await checkUserCanCommitToOffer(
    coreSDK,
    offer,
    userAccount
  );
  if (!canCommit) {
    log("Insufficient balance to commit to this offer");
  } else {
    let txResponse;
    if (nativeOffer) {
      log(
        `Offer ${offer.id} is using native currency --> meta-transaction is not possible`
      );
    } else if (!canUseMetaTx) {
      log(
        "Meta-transaction is not configured for Boson Protocol --> meta-transaction is not possible"
      );
    }
    if (!nativeOffer && canUseMetaTx) {
      if (approveNeeded) {
        let approveTx;
        if (
          coreSDK.checkMetaTxConfigSet({
            contractAddress: exchangeTokenAddress,
          })
        ) {
          // Use meta-transaction for approval, if needed
          log("signNativeMetaTxApproveExchangeToken()", exchangeTokenAddress);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { r, s, v, functionName, functionSignature } =
            await coreSDK.signNativeMetaTxApproveExchangeToken(
              exchangeTokenAddress,
              offer.price
            );
          log(
            "relayNativeMetaTransaction()",
            exchangeTokenAddress,
            functionSignature
          );
          approveTx = await coreSDK.relayNativeMetaTransaction(
            exchangeTokenAddress,
            {
              functionSignature,
              sigR: r,
              sigS: s,
              sigV: v,
            }
          );
        } else {
          log(
            `Meta-transaction is not configured for token ${offer.exchangeToken.name}'`
          );
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
          nonce,
        });
      txResponse = await coreSDK.relayMetaTransaction({
        functionName,
        functionSignature,
        sigR: r,
        sigS: s,
        sigV: v,
        nonce,
      });
    } else {
      txResponse = await coreSDK.commitToOffer(offer.id, {
        buyer: userAccount,
      });
    }
    log("commitToOffer - txResponse", txResponse);
    const txReceipt = await txResponse.wait();
    log("commitToOffer - txReceipt", txReceipt);

    return txReceipt;
  }
}

/**
 * @public
 */
export function getEthPrice(_query: TemplateStringsArray): Promise<any> {
  // TODO: leaving no explicit any for now - need to clarify what this should be doing
  const query: string = gql(_query);

  return request(
    "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
    query
  );
}

/**
 * @public
 */
export function getTokenData(
  _query: TemplateStringsArray,
  _tokenID: string
): Promise<any> {
  // TODO: leaving no explicit any for now - need to clarify what this should be doing
  const query: string = gql(_query);

  const variables: Variables = {
    token0: _tokenID,
  };

  const result = request(
    "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
    query,
    variables
  );
  return result;
}

export function getEnvironment(): {
  envName: EnvironmentType;
  configId: ConfigId;
} {
  return { envName: specifiedEnvName, configId: specifiedConfigId };
}
