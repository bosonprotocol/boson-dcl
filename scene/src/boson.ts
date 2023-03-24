import { initCoreSdk } from '@bosonprotocol/boson-dcl'
import { getUserData, UserData } from '@decentraland/Identity'
import { bosonConfig } from './bosonConfig'
import * as crypto from '@dcl/crypto-scene-utils'

// const targetEnv = 'production'
const targetEnv = 'staging'
// const targetEnv = 'testing'

async function getWalletAddress(): Promise<string> {
  return await getUserData()
    .then((userAccount) => {
      return userAccount?.publicKey || (userAccount?.userId as string)
    })
    .catch((error) => {
      log(error)
      return ''
    })
}

export async function useBoson() {
  const userAccount: UserData = (await getUserData()) as UserData

  const walletAddress = userAccount?.publicKey || userAccount?.userId
  const inventory = await crypto.avatar.getUserInventory()
  const coreSDK = await initCoreSdk(targetEnv, bosonConfig, getWalletAddress, inventory)

  return { coreSDK, userAccount, walletAddress }
}
