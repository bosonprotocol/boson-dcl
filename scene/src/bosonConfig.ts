import { BosonConfigs } from '@bosonprotocol/boson-dcl'

export const bosonConfig: BosonConfigs = {
  testing: {
    // mumbai
    biconomy: {
      apiKey: '7gGMKijfb.eeecde6e-0aef-4744-8d4c-267ce442b814',
      apiIds: {
        protocol: {
          method: 'executeMetaTransaction',
          apiId: 'eaeff5a5-2efd-4c2b-85f5-b597c79eabf2'
        },
        tokens: [
          {
            // boson
            address: '0x1f5431e8679630790e8eba3a9b41d1bb4d41aed0',
            method: 'executeMetaTransaction',
            apiId: '0cfeee86-a304-4761-a1fd-dcf63ffd153c'
          },
          {
            // weth
            address: '0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa',
            method: 'executeMetaTransaction',
            apiId: '29560f78-014f-4d48-97e8-779545606df6'
          },
          {
            // usdc
            address: '0xe6b8a5cf854791412c1f6efc7caf629f5df1c747',
            method: 'executeMetaTransaction',
            apiId: 'a3154a77-c410-456e-9d90-9f56a5787ae8'
          }
        ]
      }
    },
    providerUrl: 'https://rpc-mumbai.maticvigil.com'
  },
  staging: {
    // mumbai
    biconomy: {
      apiKey: '-zIIdi_LF.27130c33-e2c6-4cd8-9419-fb053c4963cf',
      apiIds: {
        protocol: {
          method: 'executeMetaTransaction',
          apiId: '065e7662-4562-4e65-ba9f-ad543a3243ab'
        },
        tokens: [
          {
            // boson
            address: '0x1f5431e8679630790e8eba3a9b41d1bb4d41aed0',
            method: 'executeMetaTransaction',
            apiId: '7ab660a5-e337-49d7-ad1b-fd688612c943'
          },
          {
            // weth
            address: '0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa',
            method: 'executeMetaTransaction',
            apiId: '02e4ac0a-2437-47d0-9ac2-67c94f0e313f'
          },
          {
            // usdc
            address: '0xe6b8a5cf854791412c1f6efc7caf629f5df1c747',
            method: 'executeMetaTransaction',
            apiId: 'b57012d0-3437-4780-a05c-51d956fabf98'
          }
        ]
      }
    },
    providerUrl: 'https://rpc-mumbai.maticvigil.com'
  },
  production: {
    // polygon
    biconomy: {
      apiKey: 'J-MlG5f54.3bdc0452-958a-4d74-b8af-09e9ab2308c2',
      apiIds: {
        protocol: {
          method: 'executeMetaTransaction',
          apiId: 'ad97cc4f-8ae0-4fc6-aebe-a86eda71d559'
        },
        tokens: [
          {
            // boson
            address: '0x9B3B0703D392321AD24338Ff1f846650437A43C9',
            method: 'executeMetaTransaction',
            apiId: '4b937cdc-07b6-47c9-a762-a56b9139dfef'
          },
          {
            // weth
            address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
            method: 'executeMetaTransaction',
            apiId: 'a6ce58a0-6d2a-4248-a081-b4a17a837aa6'
          },
          {
            // usdc
            address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
            method: 'executeMetaTransaction',
            apiId: '199109f4-f590-48ae-a882-e93489792b46'
          },
          {
            // dai
            address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
            method: 'executeMetaTransaction',
            apiId: 'c432c813-29ef-4bed-aa13-39f3cce86119'
          },
          {
            // usdt
            address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
            method: 'executeMetaTransaction',
            apiId: '0baf8633-65ab-4d1b-bcc9-a9249ccaaa41'
          }
        ]
      }
    },
    providerUrl: 'https://polygon-rpc.com/'
  }
}
