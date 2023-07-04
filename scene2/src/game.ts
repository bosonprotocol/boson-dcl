import { AbstractKiosk, Kiosk, getAllBalances } from '@bosonprotocol/boson-dcl'
import { SceneFactory } from "dcl-edit/build/scripts/scenes"
import { useBoson } from "./boson"

void loadScene()

async function loadScene() {
  void useBoson().then(async ({ coreSDK, userAccount, walletAddress }) => {
    log('initBoson done')
    const allBalances: object = await getAllBalances(walletAddress)
    Kiosk.init(coreSDK, userAccount, walletAddress, allBalances)
    AbstractKiosk.init(coreSDK, userAccount, walletAddress, allBalances)

    const scene = SceneFactory.createNewScene3()
  })
}
