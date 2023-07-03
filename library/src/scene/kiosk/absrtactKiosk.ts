import { DisplayProduct } from "./displayProduct";
import { GatedToken } from "./gating/gatedToken";
import { eCurrency, eGateStateEnum, eGateTokenType } from "./enums";
import { Helper } from "./helper";
import { LockScreen } from "./pages/lockScreen";
import { ProductPage } from "./pages/productPage";
import * as boson from "../../core-sdk";
import { Option, Variation } from "./UIComponents/variationComponent";
import { CoreSDK } from "../..";
import { UserData } from "@decentraland/Identity";
import {
  BaseProductV1ProductFieldsFragment,
  OfferFieldsFragment,
  ProductV1Variation,
} from "@bosonprotocol/core-sdk/dist/esm/subgraph";
import { WaveAnimationSystem } from "./animation/waveAnimationSystem";
import { toBigNumber } from "eth-connect";

/**
 * @public
 */
export class AbstractKiosk extends Entity {
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

  uiOpen = false;

  gateState: eGateStateEnum = eGateStateEnum.noMessage;
  customQuestInformation = "custom message";

  gatedTokens: GatedToken[] = [];

  onPointerDown: OnPointerDown;

  productCurrency: eCurrency = eCurrency.none;

  productName: Entity = new Entity();
  productNameText: TextShape | undefined;

  currentVariation: Variation | undefined;
  variations: Variation[] = [];

  connectedToWeb3: boolean;

  static waveAnimationSystem: WaveAnimationSystem | undefined = undefined;

  public static init(
    coreSDK: CoreSDK,
    userData: UserData,
    walletAddress: string,
    allBalances: object
  ) {
    AbstractKiosk.coreSDK = coreSDK;
    AbstractKiosk.userData = userData;
    AbstractKiosk.walletAddress = walletAddress;
    AbstractKiosk.initialised = true;
    AbstractKiosk.allBalances = allBalances;
  }

  constructor(
    _parent: Entity,
    _productUUID:
      | string
      | {
          productUUID: string;
          mainImageIndex?: number;
          imageSizes?: { [key: number]: { height: number; width: number } };
        },
    gateState?: eGateStateEnum
  ) {
    super();
    if (!AbstractKiosk.initialised) {
      throw "Call AbstractKiosk.init before contructing instances.";
    }

    if (typeof _productUUID === "string") {
      this.productUUID = _productUUID;
    } else {
      this.productUUID = _productUUID.productUUID;
      this.productImageData = { ..._productUUID };
    }

    this.connectedToWeb3 = AbstractKiosk.userData.hasConnectedWeb3;

    this.parent = _parent;
    this.setParent(_parent);
    this.addComponent(new Transform({ position: new Vector3(0, 0, 0) }));

    this.onPointerDown = new OnPointerDown(
      () => {
        this.showLockScreen();

        this.checkForGatedTokens();
      },
      {
        hoverText: "View Product",
      }
    );

    this.loadProduct();

    if (gateState) {
      this.gateState = gateState;
    } else {
      this.gateState = eGateStateEnum.noMessage;
    }

    this.lockScreen?.setGating();
    this.parent.addComponentOrReplace(this.onPointerDown);
  }

  loadProduct() {
    AbstractKiosk.coreSDK
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
        AbstractKiosk.walletAddress,
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

      this.currentOfferID = this.offer.id;
      this.productData = this.offer;

      Helper.showAllEntities([this]);
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

    let tokenDecimals = 0;
    // Check some token addresses for testing
    switch (_offer.condition.tokenAddress.toLowerCase()) {
      case "0x1f5431e8679630790e8eba3a9b41d1bb4d41aed0": //boson mumbai
      case "0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa": //weth mumbai
      case "0x9b3b0703d392321ad24338ff1f846650437a43c9": //boson polygon
      case "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619": //weth polygon
        isCurrencyToken = true;
        tokenDecimals = 18;
        break;
      case "0xe6b8a5cf854791412c1f6efc7caf629f5df1c747": //USDC mumbai
      case "0x2791bca1f2de4661ed88a30c99a7a9449aa84174": //USDC polygon
        isCurrencyToken = true;
        tokenDecimals = 6;
        break;
    }

    if (isCurrencyToken) {
      threshold = Helper.priceTransform(
        _offer.condition.threshold,
        tokenDecimals
      );
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
        AbstractKiosk.coreSDK,
        AbstractKiosk.walletAddress,
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
        }
      }
    } catch (e) {
      log(e);
    }
  }

  showDisplayProduct() {}

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

      const tokenDecimals = Helper.getTokenDecimals(
        this.productData.exchangeToken.address
      );

      const priceString: string =
        "($" +
        Helper.nPriceTransform(
          toBigNumber(this.productData.price).multipliedBy(price).toString(),
          tokenDecimals
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
}
