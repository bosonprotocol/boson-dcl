import {
  constant,
  someFn,
  ExampleComponent,
  initCoreSdk,
} from "@bosonprotocol/boson-dcl";
import { getUserAccount } from "@decentraland/EthereumController";

const targetEnv = "testing";

export async function useBoson() {
  const userAccount = await getUserAccount();

  const exampleComponent = new ExampleComponent(true);
  log(
    "Hello Boson Protocol World",
    constant,
    someFn(),
    exampleComponent.testing
  );

  const coreSDK = await initCoreSdk(targetEnv);

  return { coreSDK, userAccount };
}
