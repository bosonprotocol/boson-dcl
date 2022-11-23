import { RequestManager } from "eth-connect";
import { getProvider } from "@decentraland/web3-provider";
import { EthConnectAdapter } from "@bosonprotocol/eth-connect-sdk";
import { CoreSDK } from "@bosonprotocol/core-sdk";
import { getUserAccount } from "@decentraland/EthereumController";
import { Delay } from "./ecs-utils-clone/delay";

export async function initCoreSdk(envName: string): Promise<CoreSDK> {
  const provider = await getProvider();
  const metamaskRM = new RequestManager(provider);
  const ethConnectAdapter = new EthConnectAdapter(metamaskRM, {getSignerAddress: getUserAccount, delay});
  const coreSDK = CoreSDK.fromDefaultConfig({
    envName,
    web3Lib: ethConnectAdapter,
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