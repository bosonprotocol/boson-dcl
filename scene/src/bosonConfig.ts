import { BosonConfiguration } from '@bosonprotocol/boson-dcl'

export const bosonConfig: { [key: string]: BosonConfiguration } = {
  'staging-80001-0': {
    envName: 'staging',
    configId: 'staging-80001-0',
    biconomy: {
      apiKey: '-zIIdi_LF.27130c33-e2c6-4cd8-9419-fb053c4963cf',
      apiIds: {
        protocol: {
          method: 'executeMetaTransaction',
          apiId: 'fc2b3fb0-ae4b-405e-970e-ddcb0643350a'
        },
        tokens: [
          {
            // boson
            name: 'boson',
            address: '0x1f5431e8679630790e8eba3a9b41d1bb4d41aed0',
            method: 'executeMetaTransaction',
            apiId: '7ab660a5-e337-49d7-ad1b-fd688612c943'
          },
          {
            // weth
            name: 'weth',
            address: '0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa',
            method: 'executeMetaTransaction',
            apiId: '02e4ac0a-2437-47d0-9ac2-67c94f0e313f'
          },
          {
            // usdc
            name: 'usdc',
            address: '0xe6b8a5cf854791412c1f6efc7caf629f5df1c747',
            method: 'executeMetaTransaction',
            apiId: 'b57012d0-3437-4780-a05c-51d956fabf98'
          }
        ]
      }
    },
    providerUrl: 'https://polygon-mumbai.infura.io/v3/faa208f0a9d24b6b9eac43ae0fa72140'
  },
  'staging-5-0': {
    envName: 'staging',
    configId: 'staging-5-0',
    providerUrl: 'https://goerli.infura.io/v3/faa208f0a9d24b6b9eac43ae0fa72140'
  },
  'production-137-0': {
    envName: 'production',
    configId: 'production-137-0',
    biconomy: {
      apiKey: 'production-project-api-key',
      apiIds: {
        protocol: {
          method: 'executeMetaTransaction',
          apiId: 'production-project-protocol-api-id'
        },
        tokens: [
          {
            // boson
            name: 'boson',
            address: '0x9B3B0703D392321AD24338Ff1f846650437A43C9',
            method: 'executeMetaTransaction',
            apiId: 'production-project-boson-token-api-id'
          },
          {
            // weth
            name: 'weth',
            address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
            method: 'executeMetaTransaction',
            apiId: 'production-project-weth-token-api-id'
          },
          {
            // usdc
            name: 'usdc',
            address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
            method: 'executeMetaTransaction',
            apiId: 'production-project-usdc-token-api-id'
          },
          {
            // dai
            name: 'dai',
            address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
            method: 'executeMetaTransaction',
            apiId: 'production-project-dai-token-api-id'
          },
          {
            // usdt
            name: 'usdt',
            address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
            method: 'executeMetaTransaction',
            apiId: 'production-project-usdt-token-api-id'
          }
        ]
      }
    },
    providerUrl: 'https://polygon-mainnet.infura.io/v3/faa208f0a9d24b6b9eac43ae0fa72140'
  },
  'production-1-0': {
    envName: 'production',
    configId: 'production-1-0',
    providerUrl: 'https://mainnet.infura.io/v3/faa208f0a9d24b6b9eac43ae0fa72140'
  }
}
