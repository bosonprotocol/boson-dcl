import {
  ConfigId,
  EnvironmentType,
  getEnvConfigById,
  MetaTxConfig,
} from "@bosonprotocol/core-sdk";

/**
 * @public
 */
export type BiconomyBaseApiId = {
  method: string;
  apiId: string;
};

/**
 * @public
 */
export type NamedToken = {
  name: string;
};

/**
 * @public
 */
export type BiconomyTokenApiId = BiconomyBaseApiId &
  NamedToken & {
    address: string;
  };

/**
 * @public
 */
export type BiconomyConfig = {
  apiKey: string;
  apiIds: {
    protocol: BiconomyBaseApiId;
    tokens: BiconomyTokenApiId[];
  };
};

/**
 * @public
 */
export type BosonEnvConfig = {
  biconomy?: BiconomyConfig;
  providerUrl: string;
};

/**
 * @public
 */
export type BosonConfigs = {
  local?: BosonEnvConfig;
  testing?: BosonEnvConfig;
  staging?: BosonEnvConfig;
  production?: BosonEnvConfig;
};

/**
 * @public
 */
export function processBiconomyConfig(
  envName: EnvironmentType,
  configId: ConfigId,
  biconomyConfig: BiconomyConfig
): Partial<MetaTxConfig> {
  const defaultConfig = getEnvConfigById(envName, configId);
  const protocolApiId: { [index: string]: string } = {};
  protocolApiId[biconomyConfig.apiIds.protocol.method] =
    biconomyConfig.apiIds.protocol.apiId;
  const apiIds: { [index: string]: { [index: string]: string } } = {};
  apiIds[defaultConfig.contracts.protocolDiamond.toLowerCase()] = protocolApiId;
  biconomyConfig.apiIds.tokens.forEach((token) => {
    const tokenApiId: { [index: string]: string } = {};
    tokenApiId[token.method] = token.apiId;
    apiIds[token.address.toLowerCase()] = tokenApiId;
  });
  return {
    apiKey: biconomyConfig.apiKey,
    apiIds,
  };
}
