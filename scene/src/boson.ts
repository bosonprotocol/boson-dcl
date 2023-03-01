import { initCoreSdk, processBiconomyConfig } from '@bosonprotocol/boson-dcl'
import { getUserAccount } from '@decentraland/EthereumController'
import { bosonConfig } from './bosonConfig'

const targetEnv = 'testing'

export async function useBoson() {
  const userAccount = await getUserAccount()


  if (!bosonConfig[targetEnv]) {
    throw `Missing BOSON configuration for target environment ${targetEnv}`
  }
  const metaTx = processBiconomyConfig(targetEnv, bosonConfig[targetEnv].biconomy!)
  log('metaTx', metaTx)
  const providerUrl = bosonConfig[targetEnv]?.providerUrl

  const coreSDK = await initCoreSdk(targetEnv, providerUrl, metaTx)
  return { coreSDK, userAccount }
}
