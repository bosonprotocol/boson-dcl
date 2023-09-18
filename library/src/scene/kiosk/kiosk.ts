import { CoreSDK, subgraph } from "@bosonprotocol/core-sdk";
import { AbstractKiosk } from "./abstractKiosk";
import { WaveAnimationSystem } from "./animation/waveAnimationSystem";
import { DisplayProduct } from "./displayProduct";
import { eGateStateEnum } from "./enums";
import { Helper } from "./helper";
import { DelayedTask } from "./tasks/DelayedTask";
import { DelayedTaskSystem } from "./tasks/DelayedTaskSystem";
import { UserData } from "@decentraland/Identity";

export class Kiosk extends AbstractKiosk {
  private static alphaMat: Material;
  private static alphaTexture: Texture;

  displayProducts: DisplayProduct[];
  specialEffects: Entity;

  static kioskModel: GLTFShape;
  static kioskSpecialEffects: GLTFShape;

  public static init(
    coreSDK: CoreSDK,
    userData: UserData,
    walletAddress: string,
    allBalances: object
  ) {
    AbstractKiosk.init(coreSDK, userData, walletAddress, allBalances);
  }

  public static getAlphaMat() {
    // Set up Alpha material for all kiosks and pages to use
    if (!Kiosk.alphaTexture) {
      Kiosk.alphaTexture = new Texture("images/kiosk/ui/alpha.png", {
        hasAlpha: true,
      });
    }
    if (!Kiosk.alphaMat) {
      Kiosk.alphaMat = new Material();
      Kiosk.alphaMat.alphaTexture = Kiosk.alphaTexture;
      Kiosk.alphaMat.albedoTexture = Kiosk.alphaTexture;
      Kiosk.alphaMat.alphaTest = 1;
      Kiosk.alphaMat.transparencyMode = 1;
    }
    return Kiosk.alphaMat;
  }

  constructor(
    _transform: Transform,
    _productUUID:
      | string
      | {
          productUUID: string;
          mainImageIndex?: number;
          imageSizes?: { [key: number]: { height: number; width: number } };
          override?: {
            productName?: string;
            productDescription?: string;
            sellerName?: string;
            sellerDescription?: string;
          };
        },
    _displayProduct: DisplayProduct | DisplayProduct[] = new DisplayProduct(
      "",
      new Transform(),
      5
    ),
    gateState?: eGateStateEnum
  ) {
    super(
      { parent: undefined, panelPosition: Vector3.Zero() },
      _productUUID,
      gateState
    );
    if (Kiosk.kioskModel == undefined) {
      Kiosk.kioskModel = new GLTFShape("models/kiosk/kiosk.glb");
      Kiosk.kioskSpecialEffects = new GLTFShape(
        "models/kiosk/kiosk_effect.glb"
      );
    }

    this.displayProducts = Array.isArray(_displayProduct)
      ? _displayProduct
      : [_displayProduct];

    this.specialEffects = new Entity();
    this.specialEffects.addComponent(Kiosk.kioskSpecialEffects);
    this.specialEffects.setParent(this);
    this.specialEffects.addComponent(
      new Transform({
        position: new Vector3(0, 0, 0),
        rotation: Quaternion.Euler(0, 0, 0),
        scale: new Vector3(1, 1.2, 1),
      })
    );

    this.addComponentOrReplace(Kiosk.kioskModel);
    this.addComponentOrReplace(_transform);

    this.onPointerDown = new OnPointerDown(
      () => {
        this.showLockScreen();

        this.checkForGatedTokens();
        new DelayedTask(() => {
          if (this.displayProducts && this.displayProducts.length > 0) {
            Helper.hideAllEntities(this.displayProducts);
          }
        }, 1);
        if (this.displayProducts && this.displayProducts.length > 0) {
          this.displayProducts.forEach((displayProduct) =>
            displayProduct.hide()
          );
        }
      },
      {
        hoverText: "View Product",
      }
    );
  }

  protected override setUpSystems() {
    super.setUpSystems();
    if (!DelayedTaskSystem.instance) {
      engine.addSystem(new DelayedTaskSystem());
    }
    if (Kiosk.waveAnimationSystem == undefined) {
      Kiosk.waveAnimationSystem = new WaveAnimationSystem();
      engine.addSystem(Kiosk.waveAnimationSystem);
    }
  }

  override loadOffer(_data: {
    product: subgraph.BaseProductV1ProductFieldsFragment;
    variants: {
      offer: subgraph.OfferFieldsFragment;
      variations: subgraph.ProductV1Variation[];
    }[];
    mainImageIndex?: number;
  }) {
    super.loadOffer(_data);
    if (this.offer != undefined) {
      if (this.displayProducts && this.displayProducts.length > 0) {
        this.displayProducts.forEach((displayProduct) => {
          if (!displayProduct.created) {
            displayProduct.create(this, this.offer, _data.mainImageIndex);
            displayProduct.addComponent(this.onPointerDown);
          }
          displayProduct.show();
        });
      }

      // Create sign that goes on the kiosk model
      if (
        this.productData &&
        this.productData.metadata &&
        "product" in this.productData.metadata &&
        this.productData.metadata.product &&
        this.productData.metadata.product.title &&
        this.productNameText == undefined
      ) {
        const productNameFontSize = this.getProductNameFontSize(
          this.productData.metadata.product.title
        );
        this.productNameText = new TextShape(productNameFontSize[0]);
        this.productNameText.color = Color3.FromHexString("#BAE3F2");
        this.productNameText.fontSize = productNameFontSize[1];
        this.productName.addComponent(this.productNameText);
        this.productName.setParent(this);
        this.productName.addComponent(
          new Transform({
            position: new Vector3(0, 2.78, 0.665),
            scale: new Vector3(0.1, 0.1, 0.1),
            rotation: Quaternion.Euler(0, 180, 0),
          })
        );
      }
    }
  }

  override update(_dt: number) {
    super.update(_dt);
    try {
      if (this.displayProducts && this.displayProducts.length > 0) {
        this.displayProducts.forEach((displayProduct) =>
          displayProduct.update(_dt)
        );
      }

      //Is the UI open?
      if (this.uiOpen) {
        // If player is over 5m from the kiosk close the UI
        if (
          Vector3.Distance(
            this.getComponent(Transform).position,
            Camera.instance.position
          ) > 20 &&
          Camera.instance.position.x != 0
        ) {
          this.productPage?.hide();
          this.lockScreen?.hide();
          this.uiOpen = false;
          this.showDisplayProduct();
        }
      }
    } catch (e) {
      log(e);
    }
  }

  override showDisplayProduct() {
    if (this.displayProducts && this.displayProducts.length > 0) {
      Helper.showAllEntities(this.displayProducts);
      this.displayProducts.forEach((displayProduct) => {
        displayProduct.show();
      });
    }
    this.billboardParent.getComponent(Transform).scale = Vector3.Zero();
  }

  private getProductNameFontSize(productName: string): [string, number] {
    const minMeasurement = 4300;
    const maxMeasurement = 12500;
    const minFontSize = 6;
    const maxFontSize = 16;

    const fontSizeRange = maxFontSize - minFontSize;
    const fontSizeStep = fontSizeRange / (maxMeasurement - minMeasurement);

    // characters sorted by width
    const lookup =
      " .:,;'^`!|jl/\\i-()JfIt[]?{}sr*a\"ce_gFzLxkP+0123456789<=>~qvy$SbduEphonTBCXY#VRKZN%GUAHD@OQ&wmMW";
    let measurement = 0;
    for (let i = 0; i < productName.length; ++i) {
      const c = lookup.indexOf(productName.charAt(i));
      measurement += (c < 0 ? 60 : c) * 7 + 250;
      if (measurement > maxMeasurement) {
        productName = productName.substring(0, i - 1) + "...";
        break;
      }
    }

    if (measurement <= minMeasurement) {
      return [productName, maxFontSize];
    } else if (measurement <= maxMeasurement) {
      return [
        productName,
        maxFontSize - (measurement - minMeasurement) * fontSizeStep,
      ];
    } else {
      return [productName, minFontSize];
    }
  }
}
