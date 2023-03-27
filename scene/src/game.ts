import * as boson from '@bosonprotocol/boson-dcl'
import { Kiosk } from '@bosonprotocol/boson-dcl'
import { useBoson } from './boson'

void loadScene()

const productUUIDs = [
  '7e8bd10-14f3-be4c-a7c-c2d632080f01',
  '5ba4b06-184e-3ea-86bd-40fc1e10eb85',
  '56a8db7-5ff-66a-2d7-dffef58dc2',
  'ba60ba2-1db1-abcc-0e50-5473d737443',
  'c1f8f8b-cd06-106-86-37e2a06b2436'
]

const floor: Entity = new Entity()
floor.addComponent(
  new Transform({
    position: new Vector3(8, 0, 8)
  })
)
floor.addComponent(new GLTFShape('models/FloorBaseGrass_01.glb'))
engine.addEntity(floor)

async function loadScene() {
  void useBoson().then(async ({ coreSDK, userAccount, walletAddress }) => {
    const allBalances: object = await boson.getAllBalances(walletAddress)
    Kiosk.init(coreSDK, userAccount, walletAddress, allBalances)

    new Kiosk(
      new Transform({
        position: new Vector3(6, 0, 2),
        rotation: Quaternion.Euler(0, 0, 0),
        scale: new Vector3(1, 1, 1)
      }),
      productUUIDs[0], // product UUID
      new boson.DisplayProduct( // show a 3D model inside the kiosk
        'models/OGShirt.glb',
        new Transform({
          position: new Vector3(0, 1.7, 0),
          scale: new Vector3(1.2, 1.2, 1.2)
        }),
        50
      )
    )

    new Kiosk(
      new Transform({
        position: new Vector3(6, 0, 4),
        rotation: Quaternion.Euler(0, 0, 0),
        scale: new Vector3(1, 1, 1)
      }),
      {
        productUUID: productUUIDs[1], // product UUID
        mainImageIndex: 2, // choose which image is shown in the kiosk (default: 0)
        imageSizes: {
          // override the image size if missing from metadata (before March 2023)
          0: { height: 1100, width: 880 },
          1: { height: 1100, width: 880 },
          2: { height: 1100, width: 880 },
          3: { height: 1100, width: 880 },
          4: { height: 1100, width: 880 },
          5: { height: 1100, width: 880 }
        }
      }
    )

    new Kiosk(
      new Transform({
        position: new Vector3(6, 0, 6),
        rotation: Quaternion.Euler(0, 0, 0),
        scale: new Vector3(1, 1, 1)
      }),
      {
        productUUID: productUUIDs[2] // product UUID
      }
    )

    new Kiosk(
      new Transform({
        position: new Vector3(6, 0, 8),
        rotation: Quaternion.Euler(0, 0, 0),
        scale: new Vector3(1, 1, 1)
      }),
      {
        productUUID: productUUIDs[3] // product UUID
      }
    )

    new Kiosk(
      new Transform({
        position: new Vector3(6, 0, 10),
        rotation: Quaternion.Euler(0, 0, 0),
        scale: new Vector3(1, 1, 1)
      }),
      productUUIDs[4], // product UUID
      [
        // combine 2 3D models inside the kiosk
        new boson.DisplayProduct(
          'models/OGShirt.glb',
          new Transform({
            position: new Vector3(0, 1.7, 0),
            scale: new Vector3(1.2, 1.2, 1.2)
          }),
          50
        ),
        new boson.DisplayProduct(
          'models/s0_Mannequin_02.glb',
          new Transform({
            position: new Vector3(0, 0.78, 0),
            scale: new Vector3(0.9, 0.9, 0.9)
          }),
          50
        )
      ]
    )
  })
}
