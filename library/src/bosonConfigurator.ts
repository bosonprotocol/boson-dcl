import { getProvider } from "@decentraland/web3-provider";
import { clearInterval, setInterval } from "./ecs-utils-clone/timeOut";
import RequestManager from "eth-connect";
import { UserData, getUserData } from "@decentraland/Identity";
import { getAllBalances, initCoreSdk2 } from "./core-sdk";
import { BosonConfiguration } from "./config";
import { ConfigId } from "@bosonprotocol/core-sdk/dist/esm";

const TOKENS_LIST = {
  ethereum: [
    {
      // boson
      name: "boson",
      address: "0xC477D038d5420C6A9e0b031712f61c5120090de9",
    },
    {
      // usdc
      name: "usdc",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    },
    {
      // dai
      name: "dai",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      // usdt
      name: "usdt",
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    },
  ],
  polygon: [
    {
      // boson
      name: "boson",
      address: "0x9B3B0703D392321AD24338Ff1f846650437A43C9",
    },
    {
      // weth
      name: "weth",
      address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    },
    {
      // usdc
      name: "usdc",
      address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    },
    {
      // dai
      name: "dai",
      address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    },
    {
      // usdt
      name: "usdt",
      address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    },
  ],
  goerli: [
    {
      // boson
      name: "boson",
      address: "0xe3c811abbd19fbb9fe324eb0f30f32d1f6d20c95",
    },
    {
      // usdc
      name: "usdc",
      address: "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
    },
    {
      // dai
      name: "dai",
      address: "0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844",
    },
    {
      // usdt
      name: "usdt",
      address: "0xfad6367E97217cC51b4cd838Cc086831f81d38C2",
    },
  ],
  mumbai: [
    {
      // boson
      name: "boson",
      address: "0x1f5431e8679630790e8eba3a9b41d1bb4d41aed0",
    },
    {
      // weth
      name: "weth",
      address: "0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa",
    },
    {
      // usdc
      name: "usdc",
      address: "0xe6b8a5cf854791412c1f6efc7caf629f5df1c747",
    },
    {
      // dai
      name: "dai",
      address: "0x001b3b4d0f3714ca98ba10f6042daebf0b1b7b6f",
    },
    {
      // usdt
      name: "usdt",
      address: "0xA02f6adc7926efeBBd59Fd43A84f4E0c0c91e832",
    },
  ],
};

export class BosonConfigurator {
  private static _isInitialized = false;
  public static testEnv = false;

  static whenInitialized(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const interval = setInterval(1000, () => {
          log("Checking Boson Protocol is initialized ...");
          if (BosonConfigurator._isInitialized) {
            log("... Boson Protocol is now initialized.");
            clearInterval(interval);
            engine.removeEntity(interval);
            resolve();
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  static async getWalletAddress(): Promise<string> {
    return await getUserData()
      .then((userAccount) => {
        return userAccount?.publicKey || (userAccount?.userId as string);
      })
      .catch((error) => {
        log(error);
        return "";
      });
  }

  static async initialize(
    bosonConfig: BosonConfiguration,
    bosonConfig_test: BosonConfiguration | undefined,
    userInventory: string[] = []
  ) {
    if (BosonConfigurator._isInitialized) {
      log("WARNING !!! BOSON PROTOCOL ALREADY INITIALIZED");
    }
    const provider = await getProvider();
    const requestManager = new RequestManager(provider);
    const chainId = await requestManager.net_version();
    // If user wallet is connected on Ethereum mainnet --> PRODUCTION
    BosonConfigurator.testEnv = chainId !== "1";
    const bosonConfig_ = BosonConfigurator.testEnv
      ? bosonConfig_test || bosonConfig
      : bosonConfig;
    log(
      "Initialize BOSON on env",
      bosonConfig_.envName,
      "config",
      bosonConfig_.configId
    );
    const userAccount: UserData = (await getUserData()) as UserData;
    const walletAddress = userAccount?.publicKey || userAccount?.userId;
    const chainName = getChainNameFromConfigId(bosonConfig_.configId);

    const coreSDK = await initCoreSdk2(
      bosonConfig_,
      TOKENS_LIST[chainName],
      userInventory
    );

    const allBalances: object = await getAllBalances(walletAddress);
    BosonConfigurator._isInitialized = true;

    return {
      coreSDK,
      userAccount,
      walletAddress,
      allBalances,
      ...bosonConfig_,
    };
  }
}

function getChainNameFromConfigId(configId: ConfigId) {
  switch (configId) {
    case "testing-5-0":
    case "staging-5-0":
      return "goerli";
    case "testing-80001-0":
    case "staging-80001-0":
      return "mumbai";
    case "production-137-0":
      return "polygon";
    case "production-1-0":
      return "ethereum";
  }
  throw new Error(`Unable to find chain name from configId '${configId}'`);
}
