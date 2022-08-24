import { RequestManager } from "eth-connect";
import { getProvider } from "@decentraland/web3-provider";
import { EthConnectAdapter } from "@bosonprotocol/eth-connect-sdk";
import { CoreSDK } from "@bosonprotocol/core-sdk";

export async function initCoreSdk(chainId: number): Promise<CoreSDK> {
  const provider = await getProvider();
  const metamaskRM = new RequestManager(provider);
  const ethConnectAdapter = new EthConnectAdapter(metamaskRM);
  const coreSDK = CoreSDK.fromDefaultConfig({
    chainId,
    web3Lib: ethConnectAdapter,
  });
  return coreSDK;
}
