import {
  constant,
  someFn,
  ExampleComponent,
  initCoreSdk,
} from "@bosonprotocol/boson-dcl";
import { getUserAccount } from "@decentraland/EthereumController";

const targetEnv = "testing";
export const ADDRESS_ZERO=`0x0000000000000000000000000000000000000000`;


export async function useBoson() {
  const userAccount = await getUserAccount();

  const exampleComponent = new ExampleComponent(true);
  log(
    "Hello Boson Protocol World",
    constant,
    someFn(),
    exampleComponent.testing
  );

  const metaTx = {
    apiKey: "7gGMKijfb.eeecde6e-0aef-4744-8d4c-267ce442b814",
    apiIds: {
      "0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa": {
        "executeMetaTransaction": "29560f78-014f-4d48-97e8-779545606df6"
      },
      "0x1f5431e8679630790e8eba3a9b41d1bb4d41aed0": {
        "executeMetaTransaction": "0cfeee86-a304-4761-a1fd-dcf63ffd153c"
      },
      "0xe6b8a5cf854791412c1f6efc7caf629f5df1c747": {
        "executeMetaTransaction": "a3154a77-c410-456e-9d90-9f56a5787ae8"
      },
      "0x785a225ebac1b600ca3170c6c7fa3488a203fc21": {
        "executeMetaTransaction": "eaeff5a5-2efd-4c2b-85f5-b597c79eabf2"
      }
    }
  };
  const coreSDK = await initCoreSdk(targetEnv, metaTx);
  return { coreSDK, userAccount };
}
