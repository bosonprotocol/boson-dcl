import { BosonConfigurator } from '@bosonprotocol/boson-dcl'
import { bosonConfig } from './bosonConfig'
import * as crypto from '@dcl/crypto-scene-utils'

export async function useBoson() {
  const productionConfigId = 'production-137-0' // polygon
  // const productionConfigId = 'production-1-0' // ethereum
  const productionBosonConfig = bosonConfig[productionConfigId]
  if (!productionBosonConfig) {
    throw new Error(`Unable to get bosonConfig for configId ${productionConfigId}`)
  }
  const stagingConfigId = 'staging-80001-0' // mumbai
  // const stagingConfigId = 'staging-5-0' // goerli
  const stagingBosonConfig = bosonConfig[stagingConfigId]
  if (!stagingBosonConfig) {
    throw new Error(`Unable to get bosonConfig for configId ${stagingConfigId}`)
  }

  let inventory: string[] = []
  try {
    inventory = await crypto.avatar.getUserInventory()
  } catch (e) {}

  return BosonConfigurator.initialize(productionBosonConfig, stagingBosonConfig, inventory)
}
