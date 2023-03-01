import { EnvironmentType, getDefaultConfig, MetaTxConfig } from '@bosonprotocol/core-sdk';

export type BiconomyBaseApiId = {
  method: string;
  apiId: string;
}

export type BiconomyTokenApiId = BiconomyBaseApiId & {
  address: string;
}

export type BiconomyConfig = {
  apiKey: string;
  apiIds: {
    protocol: BiconomyBaseApiId;
    tokens: BiconomyTokenApiId[]
  }
}

export type BosonEnvConfig = {
  biconomy?: BiconomyConfig;
  providerUrl: string;
}

export type BosonConfigs = {
  local?: BosonEnvConfig,
  testing?: BosonEnvConfig,
  staging?: BosonEnvConfig,
  production?: BosonEnvConfig
}

export function processBiconomyConfig(envName: EnvironmentType, biconomyConfig: BiconomyConfig): Partial<MetaTxConfig> {
  const defaultConfig = getDefaultConfig(envName);
  const protocolApiId: any = {};
  protocolApiId[biconomyConfig.apiIds.protocol.method] = biconomyConfig.apiIds.protocol.apiId;
  const apiIds: any = {};
  apiIds[defaultConfig.contracts.protocolDiamond.toLowerCase()] = protocolApiId;
  biconomyConfig.apiIds.tokens.forEach((token) => {
    const tokenApiId: any = {};
    tokenApiId[token.method] = token.apiId;
    apiIds[token.address.toLowerCase()] = tokenApiId;
  })
  return {
    apiKey: biconomyConfig.apiKey,
    apiIds
  }
}