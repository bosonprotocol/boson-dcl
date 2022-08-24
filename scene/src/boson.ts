import {
  constant,
  someFn,
  ExampleComponent,
  initCoreSdk,
} from "@bosonprotocol/boson-dcl";
import { getUserAccount } from "@decentraland/EthereumController";

const targetChainId = 1234;

export async function useBoson() {
  const userAccount = await getUserAccount();

  const exampleComponent = new ExampleComponent(true);
  log(
    "Hello Boson Protocol World",
    constant,
    someFn(),
    exampleComponent.testing
  );

  const coreSDK = await initCoreSdk(targetChainId);

  return { coreSDK, userAccount };
}
