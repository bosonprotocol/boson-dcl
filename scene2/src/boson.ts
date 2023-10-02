import { initCoreSdk } from '@bosonprotocol/boson-dcl'
import { getUserData, UserData } from '@decentraland/Identity'
import { bosonConfig } from './bosonConfig'
import * as crypto from '@dcl/crypto-scene-utils'
import { getProvider } from '@decentraland/web3-provider'
import { RequestManager } from 'eth-connect'

// const targetEnv = 'production'
// const targetEnv = 'staging'
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
  const provider = await getProvider()
  const requestManager = new RequestManager(provider)
  const chainId = await requestManager.net_version()
  // If user wallet is connected on Ethereum mainnet --> PRODUCTION
  const targetEnv = chainId === '1' ? 'production' : 'staging'
  const configEnv = chainId === '1' ? 'production-137-0' : 'staging-80001-0'
  log('Initialize BOSON on env', targetEnv, 'config', configEnv)
  const userAccount: UserData = (await getUserData()) as UserData

  const walletAddress = userAccount?.publicKey || userAccount?.userId
  const inventory = await crypto.avatar.getUserInventory()
  const coreSDK = await initCoreSdk(targetEnv, configEnv, bosonConfig, getWalletAddress, inventory)

  return { coreSDK, userAccount, walletAddress }
}
