import { initCoreSdk } from '@bosonprotocol/boson-dcl'
import { getUserAccount } from '@decentraland/EthereumController'
import { bosonConfig } from './bosonConfig'

const targetEnv = 'testing'

export async function useBoson() {
  const userAccount = await getUserAccount()

  const coreSDK = await initCoreSdk(targetEnv, bosonConfig);
  return { coreSDK, userAccount }
}
