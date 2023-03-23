import { DisplayProduct } from "./displayProduct";
import { GatedToken } from "./gating/gatedToken";
import { eCurrency, eGateStateEnum, eGateTokenType } from "./enums";
import { Helper } from "./helper";
import { LockScreen } from "./pages/lockScreen";
import { ProductPage } from "./pages/productPage";
import { DelayedTask } from "./tasks/DelayedTask";
import * as boson from "../../core-sdk";
import { Option, Variation } from "./UIComponents/variationComponent";
import { CoreSDK } from "../..";
import { KioskUpdateSystem } from "./kioskUpdateSystem";
import { ScaleSpringSystem } from "./animation/ScaleSpringSystem";
import { DelayedTaskSystem } from "./tasks/DelayedTaskSystem";
import { UserData } from "@decentraland/Identity";
import {
  BaseProductV1ProductFieldsFragment,
  OfferFieldsFragment,
  ProductV1Variation,
} from "@bosonprotocol/core-sdk/dist/esm/subgraph";

/**
 * @public
 */
export class Kiosk extends Entity {
  private static coreSDK: CoreSDK;
  private static walletAddress: string;
  private static userData: UserData;
  private static initialised = false;
  public static allBalances: object;

  parent: Entity;
  currentItemIndex = 0;
  maxItemIndex = 0;
  offer: OfferFieldsFragment | undefined;
  productUUID = "";
  productImageData:
    | {
        mainImageIndex?: number;
        imageSizes?: { [key: number]: { height: number; width: number } };
      }
    | undefined = undefined;
  currentOfferID = "";

  productData: OfferFieldsFragment | undefined = undefined;
  // variationsData: any = undefined;

  lockScreen: LockScreen | undefined;
  productPage: ProductPage | undefined;

  static alphaMat: Material;
  static alphaTexture: Texture;

  uiOpen = false;

  gateState: eGateStateEnum = eGateStateEnum.noMessage;
  customQuestInformation = "custom message";

  gatedTokens: GatedToken[] = [];

  displayProduct: DisplayProduct;

  onPointerDown: OnPointerDown;

  productCurrency: eCurrency = eCurrency.none;

  productName: Entity = new Entity();
  productNameText: TextShape | undefined;

  specialEffects: Entity;

  static kioskModel: GLTFShape;
  static kioskSpecialEffects: GLTFShape;

  currentVariation: Variation | undefined;
  variations: Variation[] = [];

  connecectedToWeb3: boolean;

  billboardParent: Entity;

  public static init(
    coreSDK: CoreSDK,
    userData: UserData,
    walletAddress: string,
    allBalances: object
  ) {
    Kiosk.coreSDK = coreSDK;
    Kiosk.userData = userData;
    Kiosk.walletAddress = walletAddress;
    Kiosk.initialised = true;
    Kiosk.allBalances = allBalances;
  }

  constructor(
    _transform: Transform,
    _productUUID:
      | string
      | {
          productUUID: string;
          mainImageIndex?: number;
          imageSizes?: { [key: number]: { height: number; width: number } };
        },
    _displayProduct: DisplayProduct = new DisplayProduct(
      "",
      new Transform(),
      5
    ),
    gateState?: eGateStateEnum
  ) {
    super();
    if (!Kiosk.initialised) {
      throw "Call Kiosk.init before contructing instances.";
    }
    this.setUpSystems();

    if (typeof _productUUID === "string") {
      this.productUUID = _productUUID;
    } else {
      this.productUUID = _productUUID.productUUID;
      this.productImageData = { ..._productUUID };
    }

    this.connecectedToWeb3 = Kiosk.userData.hasConnectedWeb3;

    if (Kiosk.kioskModel == undefined) {
      Kiosk.kioskModel = new GLTFShape("models/kiosk/kiosk.glb");
      Kiosk.kioskSpecialEffects = new GLTFShape(
        "models/kiosk/kiosk_effect.glb"
      );
    }

    this.displayProduct = _displayProduct;

    this.billboardParent = new Entity();
    this.billboardParent.setParent(this);
    this.billboardParent.addComponent(new Billboard(false, true, false));
    this.billboardParent.addComponent(
      new Transform({ scale: new Vector3(0, 0, 0) })
    );

    this.parent = new Entity();
    this.parent.setParent(this.billboardParent);
    this.parent.addComponent(
      new Transform({
        position: new Vector3(0, -0.4, 1),
        rotation: Quaternion.Euler(0, 180, 0),
      })
    );

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

    // Set up Alpha material for all kiosks and pages to use
    if (Kiosk.alphaMat == undefined) {
      Kiosk.alphaMat = new Material();
      Kiosk.alphaTexture = new Texture("images/kiosk/ui/alpha.png");
      Kiosk.alphaMat.alphaTexture = Kiosk.alphaTexture;
      Kiosk.alphaMat.albedoTexture = Kiosk.alphaTexture;
      Kiosk.alphaMat.alphaTest = 1;
      Kiosk.alphaMat.transparencyMode = 1;
    }

    this.addComponent(Kiosk.kioskModel);
    this.addComponent(_transform);

    this.onPointerDown = new OnPointerDown(
      () => {
        this.showLockScreen();

        this.checkForGatedTokens();
        new DelayedTask(() => {
          if (this.displayProduct != undefined) {
            Helper.hideAllEntities([this.displayProduct]);
          }
        }, 1);
        if (this.displayProduct != undefined) {
          this.displayProduct.hide();
        }
      },
      {
        hoverText: "View Product",
      }
    );

    this.addComponent(this.onPointerDown);
    KioskUpdateSystem.instance.addKiosk(this);

    this.loadProduct();

    if (gateState) {
      this.gateState = gateState;
    } else {
      this.gateState = eGateStateEnum.noMessage;
    }

    this.lockScreen?.setGating();
  }

  loadProduct() {
    Kiosk.coreSDK
      .getProductWithVariants(this.productUUID)
      .then(
        (
          data: {
            product: BaseProductV1ProductFieldsFragment;
            variants: {
              offer: OfferFieldsFragment;
              variations: ProductV1Variation[];
            }[];
          } | null
        ) => {
          if (data) {
            const mainImageIndex = this.productImageData?.mainImageIndex;
            if (this.productImageData?.imageSizes) {
              const overrideProduct = (product: any) => {
                for (
                  let index = 0;
                  index < product.visuals_images.length;
                  index++
                ) {
                  if (
                    this.productImageData?.imageSizes &&
                    this.productImageData?.imageSizes[index]
                  ) {
                    product.visuals_images[index].width =
                      this.productImageData?.imageSizes[index].width;
                    product.visuals_images[index].height =
                      this.productImageData?.imageSizes[index].height;
                  }
                }
              };
              overrideProduct(data.product);
              overrideProduct(
                (data.variants[0]?.offer?.metadata as any)?.product
              );
            }
            this.loadOffer({
              ...data,
              mainImageIndex,
            });
          }
        }
      )
      .catch((e) => {
        log("getProductWithVariants", this.productUUID, "Failed", e.toString());
      });
  }

  private checkForGatedTokens() {
    if (!this.productData) {
      throw new Error("Cannot check undefined for gated tokens");
    }
    if (
      !this.productData.condition ||
      !this.productData.condition.tokenAddress
    ) {
      return;
    }
    let nftType = "";

    switch (this.productData.condition.tokenType) {
      case 0:
        nftType = "ERC20";
        break;
      case 1:
        nftType = "ERC721";
        break;
      case 2:
        nftType = "ERC1125";
        break;
    }

    boson
      .hasNft(
        Kiosk.walletAddress,
        this.productData.condition.tokenAddress,
        this.productData.condition.tokenId,
        nftType
      )
      .then((_tokenCount) => {
        if (!this.productData) {
          throw new Error("Cannot check undefined for gated tokens");
        }
        if (
          !this.productData.condition ||
          !this.productData.condition.tokenAddress
        ) {
          return;
        }
        this.unlock(_tokenCount, this.productData.condition.tokenAddress);
      });
  }

  private setUpSystems() {
    if (!KioskUpdateSystem.instance) {
      KioskUpdateSystem.instance = new KioskUpdateSystem();
    }
    if (!ScaleSpringSystem.instance) {
      ScaleSpringSystem.ensureInstance();
    }
    if (!DelayedTaskSystem.instance) {
      engine.addSystem(new DelayedTaskSystem());
    }
  }

  public unlock(_tokenCount: number, _tokenAddress = "") {
    // Set Gate token UI
    let hasEnoughTokens = false;
    this.gatedTokens.forEach((gatedToken) => {
      if (
        gatedToken.tokenAddress.toLocaleLowerCase() ==
        _tokenAddress.toLocaleLowerCase()
      ) {
        if (_tokenCount >= gatedToken.amountNeeded) {
          hasEnoughTokens = true;
        } else {
          hasEnoughTokens = false;
        }
        gatedToken.setRequirement(hasEnoughTokens);
      }
    });

    if (
      this.lockScreen != undefined &&
      this.lockScreen.lockComponent != undefined &&
      this.lockScreen.tokenGatedOffer != undefined
    ) {
      this.lockScreen.lockComponent.locked = !hasEnoughTokens;
      this.lockScreen.lockComponent.setLock();
      this.lockScreen.tokenGatedOffer.updateGatedTokensUI();
    }
  }

  showLockScreen() {
    if (!this.uiOpen) {
      this.uiOpen = true;

      this.billboardParent.getComponent(Transform).scale = Vector3.One();

      if (this.lockScreen == undefined) {
        this.lockScreen = new LockScreen(this, this.offer);
        this.lockScreen.show();
      } else {
        this.lockScreen.show();
      }
    }
  }

  loadOffer(
    _data: {
      product: BaseProductV1ProductFieldsFragment;
      variants: {
        offer: OfferFieldsFragment;
        variations: ProductV1Variation[];
      }[];
      mainImageIndex?: number;
    } | null
  ) {
    if (!_data || !_data.variants[0] || !_data.variants[0].offer) {
      throw new Error("Cannot load offer.");
    }
    this.offer = _data.variants[0].offer;

    if (this.offer == undefined) {
      return;
    }

    this.productCurrency = Helper.getProductCurrency(
      this.offer.exchangeToken.symbol
    );

    if (this.offer != undefined) {
      // Set up gated tokens
      if (this.offer.condition != undefined) {
        this.createdGatedTokens(this.offer);
      }

      if (this.displayProduct != undefined) {
        if (!this.displayProduct.created) {
          this.displayProduct.create(this, this.offer, _data.mainImageIndex);
          this.displayProduct.addComponent(this.onPointerDown);
        }
        this.displayProduct.show();
      }

      this.currentOfferID = this.offer.id;
      this.productData = this.offer;

      Helper.showAllEntities([this]);

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

    // Load variants
    if (_data.variants.length > 1) {
      // clear old variations
      this.variations = [];

      _data.variants.forEach(
        (variant: {
          offer: OfferFieldsFragment;
          variations: { id: string; type: string; option: string }[];
        }) => {
          // Only add variation if we have some stock for it
          if (parseInt(variant.offer.quantityAvailable) > 0) {
            if (
              variant.offer.metadata &&
              "uuid" in variant.offer.metadata &&
              "quantityInitial" in variant.offer
            ) {
              this.variations.push(
                new Variation(
                  parseInt(variant.offer.id),
                  variant.offer.metadata.uuid,
                  parseInt(variant.offer.quantityInitial),
                  parseInt(variant.offer.quantityAvailable),
                  new Option(
                    variant.variations[0].id,
                    variant.variations[0].type,
                    variant.variations[0].option
                  ),
                  new Option(
                    variant.variations[1].id,
                    variant.variations[1].type,
                    variant.variations[1].option
                  )
                )
              );
            }
          }
        }
      );
    }
  }

  createdGatedTokens(_offer: OfferFieldsFragment | undefined) {
    let isCurrencyToken = false;
    if (!_offer || !_offer.condition) {
      return;
    }
    let threshold: string = _offer.condition.threshold;

    Helper.currencyPrices.forEach((currency) => {
      if (!_offer || !_offer.condition) {
        return;
      }
      if (currency.tokenID == _offer.condition.tokenAddress) {
        isCurrencyToken = true;
      }
    });

    // Check some mumbai addresses for testing
    switch (_offer.condition.tokenAddress) {
      case "0x1f5431e8679630790e8eba3a9b41d1bb4d41aed0": //boson
      case "0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa": //weth
      case "0xe6b8a5cf854791412c1f6efc7caf629f5df1c747": //USDC
        isCurrencyToken = true;
    }

    if (isCurrencyToken) {
      threshold = Helper.priceTransform(_offer.condition.threshold);
    }

    if (!_offer.metadata || !_offer.metadata) {
      return;
    }
    if ("condition" in _offer.metadata && _offer.metadata.condition) {
      // Clear tokens before adding to them
      this.gatedTokens = [];
      this.gatedTokens.push(
        new GatedToken(
          threshold as unknown as number,
          _offer.metadata.condition,
          _offer.condition.tokenAddress,
          eGateTokenType.token
        )
      );
    }
  }

  showProduct(_product: OfferFieldsFragment | undefined) {
    if (this.productPage == undefined) {
      this.productPage = new ProductPage(
        Kiosk.coreSDK,
        Kiosk.walletAddress,
        this,
        _product
      );
    }
    if (
      this.productPage.lockComponent != undefined &&
      this.productPage.tokenGatedOffer != undefined
    ) {
      if (
        this.lockScreen != undefined &&
        this.lockScreen.lockComponent != undefined
      ) {
        this.productPage.lockComponent.locked =
          this.lockScreen.lockComponent.locked;
      }
      this.productPage.lockComponent.setLock();
      this.productPage.tokenGatedOffer.updateGatedTokensUI();
    }
    this.productPage.show();
  }

  update(_dt: number) {
    try {
      if (!this.isAddedToEngine()) {
        return;
      }

      if (this.displayProduct != undefined) {
        this.displayProduct.update(_dt);
      }

      //Is the UI open?
      if (this.uiOpen) {
        // If player is over 5m from the kiosk close the UI
        if (
          Vector3.Distance(
            this.getComponent(Transform).position,
            Camera.instance.position
          ) > 20
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

  showDisplayProduct() {
    if (this.displayProduct != undefined) {
      Helper.showAllEntities([this.displayProduct]);
      this.displayProduct.show();
    }
    this.billboardParent.getComponent(Transform).scale = Vector3.Zero();
  }

  updateProductPrice() {
    try {
      if (!this.productData || !this.productData.price) {
        return;
      }
      // Find and update price text values
      let price = -1;
      Helper.currencyPrices.forEach((currencyPrice) => {
        if (currencyPrice.currency == this.productCurrency) {
          price = currencyPrice.price;
        }
      });

      const priceString: string =
        "($" +
        Helper.nPriceTransform(
          price * parseFloat(this.productData.price)
        ).toFixed(2) +
        ")";

      if (this.productPage?.productDollarPriceText != undefined && price > -1) {
        this.productPage.productDollarPriceText.value = priceString;
      }

      if (this.lockScreen?.productDollarPriceText != undefined && price > -1) {
        this.lockScreen.productDollarPriceText.value = priceString;
      }
    } catch (e) {
      log(e);
    }
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
      measurement += (c < 0 ? 60 : c) * 7 + 200;
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
