import {
  BosonConfiguration,
  BosonConfigurator as BosonConfiguratorHandler,
  ProductHandle,
} from "@bosonprotocol/boson-dcl";

/* 
#DCECOMP
{
  "class": "BosonConfigurator",
  "component": "BosonConfigurator",
  "category": "BosonProtocol",
  "properties": [
    {
      "name": "envName",
      "type": "string",
      "default": "production"
    },
    {
      "name": "configId",
      "type": "string"
    },
    {
      "name": "providerUrl",
      "type": "string"
    },
    {
      "name": "biconomyConfig",
      "type": "string"
    },
    {
      "name": "envName_test",
      "type": "string",
      "default": "staging"
    },
    {
      "name": "configId_test",
      "type": "string",
      "default": ""
    },
    {
      "name": "providerUrl_test",
      "type": "string",
      "default": ""
    },
    {
      "name": "biconomyConfig_test",
      "type": "string",
      "default": ""
    }
  ]
}
*/

@Component("BosonConfigurator")
export class BosonConfigurator {
  public envName = "production";
  public configId = "";
  public providerUrl = "";
  public biconomyConfig = "";
  public envName_test = "staging";
  public configId_test = "";
  public providerUrl_test = "";
  public biconomyConfig_test = "";

  async init(entity: Entity) {
    log("BosonConfigurator:: init()", this);
    const biconomy = parseJSON(this.biconomyConfig);
    const biconomy_test = parseJSON(this.biconomyConfig_test);
    const bosonConfig: BosonConfiguration = {
      envName: this.envName,
      configId: this.configId,
      providerUrl: this.providerUrl,
      biconomy,
    };
    const bosonConfig_test: BosonConfiguration | undefined = this.configId_test
      ? {
          envName: this.envName_test,
          configId: this.configId_test,
          providerUrl: this.providerUrl_test,
          biconomy: biconomy_test,
        }
      : undefined;
    const {
      coreSDK,
      userAccount,
      walletAddress,
      allBalances,
      envName,
      configId,
    } = await BosonConfiguratorHandler.initialize(
      bosonConfig,
      bosonConfig_test,
      []
    );
    ProductHandle.init(coreSDK, userAccount, walletAddress, allBalances);
  }
}

function parseJSON(str: string | undefined) {
  if (str) {
    try {
      return JSON.parse(str);
    } catch (e) {
      log(e);
    }
  }
  return undefined;
}
