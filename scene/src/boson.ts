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
  log('chainId', chainId)
  // If user wallet is connected on Ethereum mainnet --> PRODUCTION
  const targetEnv = chainId === '1' ? 'production' : 'staging'
  const configId = chainId === '1' ? 'production-137-0' : 'staging-80001-0'
  log('Initialize BOSON on env', targetEnv, 'config', configId)
  const userAccount: UserData = (await getUserData()) as UserData

  const walletAddress = userAccount?.publicKey || userAccount?.userId
  let inventory: string[] = [];
  try {
    inventory = await crypto.avatar.getUserInventory()
  } catch (e) {}
  const coreSDK = await initCoreSdk(targetEnv, configId, bosonConfig, getWalletAddress, inventory)

  return { coreSDK, userAccount, walletAddress, targetEnv, configId }
}
