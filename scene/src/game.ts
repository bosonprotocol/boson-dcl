import { Kiosk, ProductHandle, getAllBalances, DisplayProduct } from '@bosonprotocol/boson-dcl'
import { useBoson } from './boson'

const aCube = new Entity('aCube')
aCube.addComponent(new Transform({ position: new Vector3(8, 2, 5) }))
aCube.addComponent(new BoxShape())
engine.addEntity(aCube)

void loadScene()

const productsPerEnv: { [key: string]: Array<{ sellerId: string; productUUID: string }> } = {
  'staging-80001-0': [
    { sellerId: '4', productUUID: 'a234728-dc54-faa6-f1e-0886d3d0e18' },
    { sellerId: '4', productUUID: 'f04f0f6-107a-b1ef-a4af-dc4bd0a8eb1f' },
    { sellerId: '4', productUUID: '5d7ad1-64ff-e80-bce8-14a6f32f72e' },
    { sellerId: '4', productUUID: '3fe1ace-b45e-715b-4be-a48a053c566f' },
    { sellerId: '4', productUUID: 'cbbedf-6331-8b77-560f-3c144f6d8b23' }
  ],
  'production-137-0': [
    { sellerId: '2', productUUID: 'a234728-dc54-faa6-f1e-0886d3d0e18' },
    { sellerId: '2', productUUID: 'f04f0f6-107a-b1ef-a4af-dc4bd0a8eb1f' },
    { sellerId: '2', productUUID: '5d7ad1-64ff-e80-bce8-14a6f32f72e' },
    { sellerId: '13', productUUID: '3fe1ace-b45e-715b-4be-a48a053c566f' },
    { sellerId: '202', productUUID: 'cbbedf-6331-8b77-560f-3c144f6d8b23' }
  ]
}

const floor: Entity = new Entity()
floor.addComponent(
  new Transform({
    position: new Vector3(8, 0, 8)
  })
)
floor.addComponent(new GLTFShape('models/FloorBaseGrass_01.glb'))
engine.addEntity(floor)

async function loadScene() {
  void useBoson().then(async ({ coreSDK, userAccount, walletAddress, targetEnv, configId }) => {
    const allBalances: object = await getAllBalances(walletAddress)
    Kiosk.init(coreSDK, userAccount, walletAddress, allBalances)

    const productIDs = productsPerEnv[configId]

    new Kiosk(
      new Transform({
        position: new Vector3(6, 0, 2),
        rotation: Quaternion.Euler(0, 0, 0),
        scale: new Vector3(1, 1, 1)
      }),
      productIDs[0].sellerId, // sellerId
      productIDs[0].productUUID, // product UUID
      new DisplayProduct( // show a 3D model inside the kiosk
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
      productIDs[1].sellerId, // sellerId
      {
        productUUID: productIDs[1].productUUID, // product UUID
        mainImageIndex: 2, // choose which image is shown in the kiosk (default: 0)
        imageSizes: {
          // override the image size if missing from metadata (before March 2023)
          0: { height: 1100, width: 880 },
          1: { height: 1100, width: 880 },
          2: { height: 1100, width: 880 },
          3: { height: 1100, width: 880 },
          4: { height: 1100, width: 880 },
          5: { height: 1100, width: 880 }
        },
        override: {
          productName: 'over. product name',
          productDescription: 'overridden product description',
          sellerName: 'over. seller name',
          sellerDescription: 'overridden seller description'
        }
      }
    )

    new Kiosk(
      new Transform({
        position: new Vector3(6, 0, 6),
        rotation: Quaternion.Euler(0, 0, 0),
        scale: new Vector3(1, 1, 1)
      }),
      productIDs[2].sellerId, // sellerId
      {
        productUUID: productIDs[2].productUUID // product UUID
      }
    )

    new Kiosk(
      new Transform({
        position: new Vector3(6, 0, 8),
        rotation: Quaternion.Euler(0, 0, 0),
        scale: new Vector3(1, 1, 1)
      }),
      productIDs[3].sellerId, // sellerId
      {
        productUUID: productIDs[3].productUUID // product UUID
      }
    )

    new Kiosk(
      new Transform({
        position: new Vector3(6, 0, 10),
        rotation: Quaternion.Euler(0, 0, 0),
        scale: new Vector3(1, 1, 1)
      }),
      productIDs[4].sellerId, // sellerId
      productIDs[4].productUUID, // product UUID
      [
        // combine 2 3D models inside the kiosk
        new DisplayProduct(
          'models/OGShirt.glb',
          new Transform({
            position: new Vector3(0, 1.7, 0),
            scale: new Vector3(1.2, 1.2, 1.2)
          }),
          50
        ),
        new DisplayProduct(
          'models/s0_Mannequin_02.glb',
          new Transform({
            position: new Vector3(0, 0.78, 0),
            scale: new Vector3(0.9, 0.9, 0.9)
          }),
          50
        )
      ]
    )

    new ProductHandle(
      {
        parent: aCube,
        panelPosition: new Vector3(0, -2, 2)
      },
      productIDs[4].sellerId, // sellerId
      {
        productUUID: productIDs[4].productUUID,
        override: {
          productName: 'over. product name',
          productDescription: 'overridden product description',
          sellerName: 'over. seller name',
          sellerDescription: 'overridden seller description'
        }
      }
    )
  })
}
