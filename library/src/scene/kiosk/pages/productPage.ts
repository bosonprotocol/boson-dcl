import { ScaleSpringComponent } from "../animation/ScaleSpringComponent";
import { DescriptionPage } from "./descriptionPage";
import { Helper } from "../helper";
import { ProcessPage } from "./processPage";
import { DelayedTask } from "../tasks/DelayedTask";
import { HowItWorksLink } from "../UIComponents/howItWorksLink";
import { QuestionMark } from "../UIComponents/questionMark";
import { Separator } from "../UIComponents/separator";
import { TokenGatedOffer } from "../UIComponents/tokenGatedOffer";
import { LockComponent } from "../UIComponents/lockComponent";
import { VariationComponent } from "../UIComponents/variationComponent";
import { CoreSDK } from "../../..";
import { FairExchangePolicyPage } from "./fairExchangePolicyPage";
import { toBigNumber } from "eth-connect";
import { ProductHandle } from "../productHandle";
import { Kiosk } from "../kiosk";

export class ProductPage {
  private _coreSdk: CoreSDK;
  private _userAccount: string;

  kiosk: ProductHandle;

  productData: any = undefined;

  parent: Entity;

  backgroundWidget: Entity = new Entity();
  backGroundMat: Material = new Material();
  backGroundTexture: Texture;

  productImage: Entity = new Entity();
  productImageMat: Material = new Material();
  productTextures: Texture[] = [];
  productImageSizeRatios: number[] = [];

  productImageLoadingEntity: Entity = new Entity();
  productImageLoadingText: TextShape;

  productImageIndex = 0;

  currencySymbolImage: Entity = new Entity();
  currencySymbolMat: Material = new Material();

  // Image controls

  productPrevImageEntity: Entity = new Entity();
  productPrevImageMat: Material = new Material();
  productPrevImageTexture: Texture;

  productNextImageEntity: Entity = new Entity();
  productNextImageMat: Material = new Material();
  productNextImageTexture: Texture;

  productZoomEntity: Entity = new Entity();
  productZoomMat: Material = new Material();
  productZoomTexture: Texture;
  productZoomOutTexture: Texture;
  productZoomOutPointer: OnPointerDown;

  public productName: Entity = new Entity();
  productNameText: TextShape;

  productPrice: Entity = new Entity();
  productPriceText: TextShape;
  productDollarPrice: Entity = new Entity();
  productDollarPriceText: TextShape;

  greyBoxEntity: Entity = new Entity();
  greyBoxMat: Material = new Material();

  logoEntity: Entity = new Entity();
  logoMat: Material = new Material();
  logoTexture: Texture;

  closeButtonEntity: Entity = new Entity();
  closeButtonMat: Material = new Material();
  closeButtonTexture: Texture;

  whiteDetailsBox: Entity = new Entity();
  whiteDetailsMat: Material = new Material();

  underProductWhiteBox: Entity = new Entity();
  underProductWhiteMat: Material = new Material();

  viewFullDescription: Entity = new Entity();
  viewFullDescriptionText: TextShape;
  viewFullDescriptionClickBox: Entity = new Entity();

  howItWorksLink: Entity;

  // Information Section
  informationSectionEntity: Entity = new Entity();
  informationSectionText: TextShape | undefined;

  informationSectionDataEntity: Entity = new Entity();
  informationSectionDataText: TextShape | undefined;
  informationSectionDataLinkEntity: Entity = new Entity();
  informationSectionDataLinkText: TextShape | undefined;

  // Pages
  productDescriptionPage: DescriptionPage;
  processPage: ProcessPage;
  fairExchangePage: FairExchangePolicyPage;

  termsAndConditionsEntity: Entity = new Entity();
  termsAndConditionsText: TextShape | undefined;
  termsAndConditionsEntityLink: Entity = new Entity();
  termsAndConditionsTextLink: TextShape | undefined;
  termsAndConditionsClickBox: Entity = new Entity();
  termsAndConditionsClickBox2: Entity = new Entity();

  // Hovers
  redeemableHover: QuestionMark;
  sellerDepositHover: QuestionMark;
  buyerCancelHover: QuestionMark;
  exchangeHover: QuestionMark;
  disputeHover: QuestionMark;

  // Proceed button
  commitButtonEntity: Entity = new Entity();
  commitButtonMat: Material = new Material();
  commitButtonTexture: Texture | undefined;
  commitButtonTextureLocked: Texture | undefined;
  commitLocked = true;

  // Cancel button
  cancelButtonEntity: Entity = new Entity();
  cancelButtonMat: Material = new Material();
  cancelButtonTexture: Texture | undefined;

  // Products remaining
  productsRemaining: Entity = new Entity();
  productsRemainingText: TextShape | undefined;

  // Locking
  tokenGatedOffer: TokenGatedOffer | undefined;
  public lockComponent: LockComponent | undefined;

  // Variation options
  variationComponent: VariationComponent | undefined;

  // Locking when not web3 or dont have enough funds
  lockErrorName: Entity = new Entity();
  lockErrorNameText: TextShape | undefined;

  // Artist name
  artistName: Entity = new Entity();
  artistNameText: TextShape | undefined;

  // Artist logo
  artistLogoEntity: Entity = new Entity();
  artistLogoMat: Material = new Material();

  // Redeemeum logo
  redeemeumLogoEntity: Entity = new Entity();
  redeemeumLogoMat: Material = new Material();
  redeemeumLogoTexture: Texture;

  enoughFunds = false;

  constructor(
    coreSDK: CoreSDK,
    userAccount: string,
    _kiosk: ProductHandle,
    _productData: any
  ) {
    this._coreSdk = coreSDK;
    this._userAccount = userAccount;

    this.productData = _productData;

    this.kiosk = _kiosk;
    this.parent = new Entity();
    this.parent.setParent(_kiosk.parent);
    this.parent.addComponent(
      new Transform({
        position: new Vector3(0, 2, 0),
        scale: new Vector3(0, 0, 0),
      })
    );

    this.productDescriptionPage = new DescriptionPage(
      this.kiosk,
      this.parent,
      _productData
    );
    this.processPage = new ProcessPage(
      this._coreSdk,
      this._userAccount,
      this.kiosk,
      this.parent,
      _productData
    );
    this.fairExchangePage = new FairExchangePolicyPage(
      this.kiosk,
      this.parent,
      _productData
    );

    // Background widget
    this.backgroundWidget = new Entity();
    this.backgroundWidget.addComponent(new PlaneShape());
    this.backgroundWidget.setParent(this.parent);
    this.backgroundWidget.addComponent(
      new Transform({
        position: new Vector3(0, 0, 0),
        rotation: Quaternion.Euler(0, 0, 0),
        scale: new Vector3(2.6, 2.1, 2),
      })
    );

    this.backGroundMat = new Material();
    this.backGroundTexture = new Texture(
      "images/kiosk/ui/widget_background_white.png",
      { hasAlpha: true }
    );

    this.backGroundMat.albedoTexture = this.backGroundTexture;
    this.backGroundMat.emissiveIntensity = 1;
    this.backGroundMat.emissiveColor = Color3.White();
    this.backGroundMat.emissiveTexture = this.backGroundTexture;
    this.backGroundMat.transparencyMode = 1;
    this.backgroundWidget.addComponent(this.backGroundMat);

    this.productImage.addComponent(new PlaneShape());
    this.productImage.setParent(this.parent);
    this.productImage.addComponent(
      new Transform({
        position: new Vector3(-0.65, 0.05, -0.0017),
        rotation: Quaternion.Euler(180, 180, 0),
        scale: new Vector3(1, 1, 0.01),
      })
    );

    if (this.productData.metadata.product.visuals_images != undefined) {
      if (this.productData.metadata.product.visuals_images.length > 0) {
        this.productData.metadata.product.visuals_images.forEach(
          (image: { url: string; width: number; height: number }) => {
            Helper.getIPFSImageTexture(image.url).then((texture: Texture) => {
              this.productTextures.push(texture);
              this.productImageSizeRatios.push(
                image.width > 0 ? image.height / image.width : 1
              );

              if (!this.productImage.hasComponent(Material)) {
                this.productImageMat.albedoTexture = texture;
                this.productImageMat.emissiveIntensity = 1;
                this.productImageMat.emissiveColor = Color3.White();
                this.productImageMat.emissiveTexture = texture;
                this.productImage.addComponent(this.productImageMat);
              }
              this.setImageArrowVisibility();
              this.calculateImageSize();
            });
          }
        );
      }
    }

    this.productImageLoadingText = new TextShape("Loading Image...");

    this.productImageLoadingText.color = Color3.Black();
    this.productImageLoadingText.fontSize = 20;
    this.productImageLoadingEntity.addComponent(this.productImageLoadingText);
    this.productImageLoadingEntity.setParent(this.parent);
    this.productImageLoadingEntity.addComponent(
      new Transform({
        position: new Vector3(-0.65, 0.05, -0.0015),
        scale: new Vector3(0.05, 0.05, 0.05),
        rotation: Quaternion.Euler(0, 0, 0),
      })
    );

    this.productNameText = new TextShape(
      Helper.addNewLinesInString(this.productData.metadata.product.title, 32, 1)
    );

    this.productNameText.color = Color3.Black();
    this.productNameText.fontSize = 20;
    this.productNameText.hTextAlign = "left";
    this.productName.addComponent(this.productNameText);
    this.productName.setParent(this.parent);
    this.productName.addComponent(
      new Transform({
        position: new Vector3(-1, 0.95, -0.002),
        scale: new Vector3(0.05, 0.05, 0.05),
        rotation: Quaternion.Euler(0, 0, 0),
      })
    );

    const tokenDecimals = Helper.getTokenDecimals(
      this.productData.exchangeToken.address
    );

    this.productPriceText = new TextShape(
      Helper.priceTransform(this.productData.price, tokenDecimals)
    );
    this.productPriceText.color = Color3.Black();
    this.productPriceText.fontSize = 20;
    this.productPriceText.hTextAlign = "left";
    this.productPrice.addComponent(this.productPriceText);
    this.productPrice.setParent(this.parent);
    this.productPrice.addComponent(
      new Transform({
        position: new Vector3(0.22, 0.7, -0.002),
        scale: new Vector3(0.05, 0.05, 0.05),
        rotation: Quaternion.Euler(0, 0, 0),
      })
    );

    this.productDollarPriceText = new TextShape("($ Loading...)");
    this.productDollarPriceText.color = Color3.Gray();
    this.productDollarPriceText.fontSize = 9;
    this.productDollarPriceText.hTextAlign = "left";
    this.productDollarPriceText.outlineColor = Color3.Gray();
    this.productDollarPriceText.outlineWidth = 0.2;
    this.productDollarPrice.addComponent(this.productDollarPriceText);
    this.productDollarPrice.setParent(this.parent);
    this.productDollarPrice.addComponent(
      new Transform({
        position: new Vector3(0.23, 0.62, -0.002),
        scale: new Vector3(0.05, 0.05, 0.05),
        rotation: Quaternion.Euler(0, 0, 0),
      })
    );

    this.currencySymbolImage.addComponent(new PlaneShape());
    this.currencySymbolImage.setParent(this.parent);
    this.currencySymbolImage.addComponent(
      new Transform({
        position: new Vector3(0.14, 0.7, -0.002),
        rotation: Quaternion.Euler(180, 180, 0),
        scale: new Vector3(0.1, 0.1, 0.01),
      })
    );

    // Add currency name to the hover text
    this.currencySymbolImage.addComponent(
      new OnPointerDown(
        () => {
          // Intentionally left empty
        },
        { hoverText: Helper.getCurrencyLabel(this.kiosk.productCurrency) }
      )
    );

    this.currencySymbolMat = new Material();
    this.currencySymbolMat.albedoTexture = Helper.getCurrencyTexture(
      this.kiosk.productCurrency
    );
    this.currencySymbolMat.emissiveIntensity = 1;
    this.currencySymbolMat.emissiveColor = Color3.White();
    this.currencySymbolMat.emissiveTexture = Helper.getCurrencyTexture(
      this.kiosk.productCurrency
    );
    this.currencySymbolMat.transparencyMode = 2;
    this.currencySymbolImage.addComponent(this.currencySymbolMat);

    // Grey Box
    this.greyBoxEntity = new Entity();
    this.greyBoxEntity.addComponent(new PlaneShape());
    this.greyBoxEntity.setParent(this.parent);
    this.greyBoxEntity.addComponent(
      new Transform({
        position: new Vector3(0, 0, -0.001),
        rotation: Quaternion.Euler(180, 180, 0),
        scale: new Vector3(2.6, 1.72, 0.01),
      })
    );
    this.greyBoxMat = new Material();
    this.greyBoxMat.emissiveIntensity = 1;
    this.greyBoxMat.emissiveColor = Color3.Gray();
    this.greyBoxEntity.addComponent(this.greyBoxMat);

    // Boson Logo
    this.logoEntity = new Entity();
    this.logoEntity.addComponent(new PlaneShape());
    this.logoEntity.setParent(this.parent);
    this.logoEntity.addComponent(
      new Transform({
        position: new Vector3(0, -0.95, -0.0019),
        rotation: Quaternion.Euler(180, 180, 0),
        scale: new Vector3(0.435, 0.103, 0.01),
      })
    );

    this.logoMat = new Material();
    this.logoTexture = new Texture("images/kiosk/ui/boson_logo_black.png", {
      hasAlpha: true,
    });

    this.logoMat.albedoTexture = this.logoTexture;
    this.logoMat.emissiveIntensity = 1;
    this.logoMat.emissiveColor = Color3.White();
    this.logoMat.emissiveTexture = this.logoTexture;
    this.logoMat.transparencyMode = 1;
    this.logoEntity.addComponent(this.logoMat);

    // Image controls

    this.productPrevImageEntity = new Entity();
    this.productPrevImageEntity.addComponent(new PlaneShape());
    this.productPrevImageEntity.setParent(this.parent);
    this.productPrevImageEntity.addComponent(
      new Transform({
        position: new Vector3(-1.1, 0.05, -0.0019),
        rotation: Quaternion.Euler(0, 180, 0),
        scale: new Vector3(0.12, 0.1, 0.01),
      })
    );
    this.productPrevImageEntity.addComponent(
      new OnPointerDown(
        () => {
          this.showPreviousImage();
        },
        {
          hoverText: "Previous Image",
        }
      )
    );

    this.productPrevImageMat = new Material();
    this.productPrevImageTexture = new Texture(
      "images/kiosk/ui/prev_image.png",
      {
        hasAlpha: true,
      }
    );

    this.productPrevImageMat.albedoTexture = this.productPrevImageTexture;
    this.productPrevImageMat.emissiveIntensity = 1;
    this.productPrevImageMat.emissiveColor = Color3.White();
    this.productPrevImageMat.emissiveTexture = this.productPrevImageTexture;
    this.productPrevImageMat.transparencyMode = 1;
    this.productPrevImageEntity.addComponent(this.productPrevImageMat);

    this.productNextImageEntity = new Entity();
    this.productNextImageEntity.addComponent(new PlaneShape());
    this.productNextImageEntity.setParent(this.parent);
    this.productNextImageEntity.addComponent(
      new Transform({
        position: new Vector3(-0.2, 0.05, -0.0018),
        rotation: Quaternion.Euler(0, 180, 0),
        scale: new Vector3(0.12, 0.1, 0.01),
      })
    );
    this.productNextImageEntity.addComponent(
      new OnPointerDown(
        () => {
          this.showNextImage();
        },
        {
          hoverText: "Next Image",
        }
      )
    );

    this.productNextImageMat = new Material();
    this.productNextImageTexture = new Texture(
      "images/kiosk/ui/next_image.png",
      {
        hasAlpha: true,
      }
    );

    this.productNextImageMat.albedoTexture = this.productNextImageTexture;
    this.productNextImageMat.emissiveIntensity = 1;
    this.productNextImageMat.emissiveColor = Color3.White();
    this.productNextImageMat.emissiveTexture = this.productNextImageTexture;
    this.productNextImageMat.transparencyMode = 1;
    this.productNextImageEntity.addComponent(this.productNextImageMat);

    this.productZoomOutPointer = new OnPointerDown(
      () => {
        this.ZoomOut();
      },
      {
        hoverText: "Zoom out",
      }
    );

    this.productZoomEntity = new Entity();
    this.productZoomEntity.addComponent(new PlaneShape());
    this.productZoomEntity.setParent(this.parent);
    this.productZoomEntity.addComponent(
      new Transform({
        position: new Vector3(-1.1, 0.5, -0.0019),
        rotation: Quaternion.Euler(0, 0, 0),
        scale: new Vector3(0.12, 0.12, 0.01),
      })
    );
    this.productZoomEntity.addComponent(
      new OnPointerDown(
        () => {
          this.ZoomIn();
        },
        {
          hoverText: "Zoom in",
        }
      )
    );

    this.productZoomMat = new Material();
    this.productZoomTexture = new Texture("images/kiosk/ui/product_zoom.png", {
      hasAlpha: true,
    });
    this.productZoomOutTexture = new Texture(
      "images/kiosk/ui/product_zoom_out.png",
      {
        hasAlpha: true,
      }
    );

    this.productZoomMat.albedoTexture = this.productZoomTexture;
    this.productZoomMat.emissiveIntensity = 1;
    this.productZoomMat.emissiveColor = Color3.White();
    this.productZoomMat.emissiveTexture = this.productZoomTexture;
    this.productZoomMat.transparencyMode = 1;
    this.productZoomEntity.addComponent(this.productZoomMat);

    // Close Button
    this.closeButtonEntity = new Entity();
    this.closeButtonEntity.addComponent(new PlaneShape());
    this.closeButtonEntity.setParent(this.parent);
    this.closeButtonEntity.addComponent(
      new Transform({
        position: new Vector3(1.19, 0.95, -0.002),
        rotation: Quaternion.Euler(180, 180, 0),
        scale: new Vector3(0.07, 0.07, 0.01),
      })
    );
    this.closeButtonEntity.addComponent(
      new OnPointerDown(
        () => {
          this.hide();
          this.kiosk.uiOpen = false;
          this.kiosk.showDisplayProduct();
        },
        {
          hoverText: "Close",
        }
      )
    );

    this.closeButtonMat = new Material();
    this.closeButtonTexture = new Texture(
      "images/kiosk/ui/close_btn_dark.png",
      {
        hasAlpha: true,
      }
    );

    this.closeButtonMat.albedoTexture = this.closeButtonTexture;
    this.closeButtonMat.emissiveIntensity = 0.5;
    this.closeButtonMat.emissiveColor = Color3.White();
    this.closeButtonMat.emissiveTexture = this.closeButtonTexture;
    this.closeButtonMat.transparencyMode = 2;
    this.closeButtonEntity.addComponent(this.closeButtonMat);

    // White Details Box
    this.whiteDetailsBox = new Entity();
    this.whiteDetailsBox.addComponent(new PlaneShape());
    this.whiteDetailsBox.setParent(this.parent);
    this.whiteDetailsBox.addComponent(
      new Transform({
        position: new Vector3(0.65, 0, -0.0015),
        rotation: Quaternion.Euler(180, 180, 0),
        scale: new Vector3(1.6 / 1.4, 2 / 1.4 + 0.1, 0.01),
      })
    );
    this.whiteDetailsMat = new Material();
    this.whiteDetailsMat.emissiveIntensity = 1;
    this.whiteDetailsMat.emissiveColor = Color3.White();
    this.whiteDetailsBox.addComponent(this.whiteDetailsMat);

    // Under Product White Box
    this.underProductWhiteBox = new Entity();
    this.underProductWhiteBox.addComponent(new PlaneShape());
    this.underProductWhiteBox.setParent(this.parent);
    this.underProductWhiteBox.addComponent(
      new Transform({
        position: new Vector3(-0.65, -0.72, -0.0015),
        rotation: Quaternion.Euler(180, 180, 0),
        scale: new Vector3(1.6 / 1.4, 0.1, 0.01),
      })
    );
    this.underProductWhiteMat = new Material();
    this.underProductWhiteMat.emissiveIntensity = 1;
    this.underProductWhiteMat.emissiveColor = Color3.White();
    this.underProductWhiteBox.addComponent(this.underProductWhiteMat);

    // View Full Description
    this.viewFullDescriptionText = new TextShape("View full description");
    this.viewFullDescriptionText.color = Color3.Blue();
    this.viewFullDescriptionText.fontSize = 4;
    this.viewFullDescriptionText.outlineColor = Color3.Blue();
    this.viewFullDescriptionText.outlineWidth = 0.25;
    this.viewFullDescription.addComponent(this.viewFullDescriptionText);
    this.viewFullDescription.setParent(this.parent);
    this.viewFullDescription.addComponent(
      new Transform({
        position: new Vector3(-0.35, -0.72, -0.002),
        scale: new Vector3(0.1, 0.1, 0.1),
        rotation: Quaternion.Euler(0, 0, 0),
      })
    );

    this.viewFullDescriptionClickBox.setParent(this.viewFullDescription);
    this.viewFullDescriptionClickBox.addComponent(new PlaneShape());
    this.viewFullDescriptionClickBox.addComponent(
      new Transform({
        scale: new Vector3(4, 1, 1),
      })
    );

    this.viewFullDescriptionClickBox.addComponent(
      Kiosk.getAlphaMat() as Material
    );
    this.viewFullDescriptionClickBox.addComponent(
      new OnPointerDown(
        () => {
          this.productDescriptionPage.show();
          if (this.lockComponent != undefined) {
            this.lockComponent.hide();
          }
          // If product image was zoomed in, zoom it out
          if (this.productImage.hasComponent(this.productZoomOutPointer)) {
            this.ZoomOut();
          }
        },
        {
          hoverText: "View full description",
        }
      )
    );

    // How It Works
    this.howItWorksLink = new HowItWorksLink(
      this.kiosk,
      this.parent,
      new Transform({
        position: new Vector3(0.65, -0.72, -0.002),
        scale: new Vector3(0.1, 0.1, 0.1),
        rotation: Quaternion.Euler(0, 0, 0),
      })
    );

    // Information Section
    this.informationSectionText = new TextShape(
      "Redeemable until\n\nSeller deposit\n\nBuyer cancel. pen.\n\nExchange policy\n\nDispute resolver"
    );
    this.informationSectionText.color = Color3.Black();
    this.informationSectionText.fontSize = 4;
    this.informationSectionText.outlineColor = Color3.Black();
    this.informationSectionText.outlineWidth = 0.1;
    this.informationSectionText.hTextAlign = "left";
    this.informationSectionText.vTextAlign = "top";
    this.informationSectionEntity.addComponent(this.informationSectionText);
    this.informationSectionEntity.setParent(this.parent);
    this.informationSectionEntity.addComponent(
      new Transform({
        position: new Vector3(0.12, 0.105, -0.002),
        scale: new Vector3(0.1, 0.1, 0.1),
        rotation: Quaternion.Euler(0, 0, 0),
      })
    );

    const redeemableUntilDate: number =
      this.productData.voucherRedeemableUntilDate * 1000;
    const sellerDeposit: string = this.productData.sellerDeposit;
    const buyerCancelPenalty: string = this.productData.buyerCancelPenalty;

    this.informationSectionDataText = new TextShape(
      new Date(redeemableUntilDate).toLocaleDateString() +
        "\n\n" +
        Helper.priceTransform(sellerDeposit, tokenDecimals) +
        " " +
        Helper.getCurrencySymbol(this.kiosk.productCurrency).toUpperCase() +
        " (" +
        Math.round(
          toBigNumber(this.productData.price).eq(0)
            ? 0
            : toBigNumber(this.productData.sellerDeposit)
                .div(this.productData.price)
                .toNumber() * 100
        ) +
        "%)" +
        "\n\n" +
        Helper.priceTransform(buyerCancelPenalty, tokenDecimals) +
        " " +
        Helper.getCurrencySymbol(this.kiosk.productCurrency).toUpperCase() +
        " (" +
        Math.round(
          toBigNumber(this.productData.price).eq(0)
            ? 0
            : toBigNumber(this.productData.buyerCancelPenalty)
                .div(this.productData.price)
                .toNumber() * 100
        ) +
        "%)"
    );
    this.informationSectionDataText.color = Color3.Black();
    this.informationSectionDataText.fontSize = 4;
    this.informationSectionDataText.outlineColor = Color3.Black();
    this.informationSectionDataText.outlineWidth = 0.1;
    this.informationSectionDataText.hTextAlign = "left";
    this.informationSectionDataText.vTextAlign = "top";
    this.informationSectionDataEntity.addComponent(
      this.informationSectionDataText
    );
    this.informationSectionDataEntity.setParent(this.parent);
    this.informationSectionDataEntity.addComponent(
      new Transform({
        position: new Vector3(0.7, 0.105, -0.002),
        scale: new Vector3(0.1, 0.1, 0.1),
        rotation: Quaternion.Euler(0, 0, 0),
      })
    );

    this.informationSectionDataLinkText = new TextShape("Fair Exchange Policy");
    this.informationSectionDataLinkText.color = Color3.Blue();
    this.informationSectionDataLinkText.fontSize = 4;
    this.informationSectionDataLinkText.outlineColor = Color3.Blue();
    this.informationSectionDataLinkText.outlineWidth = 0.1;
    this.informationSectionDataLinkText.hTextAlign = "left";
    this.informationSectionDataLinkText.vTextAlign = "top";
    this.informationSectionDataLinkEntity.addComponent(
      this.informationSectionDataLinkText
    );
    this.informationSectionDataLinkEntity.setParent(this.parent);
    this.informationSectionDataLinkEntity.addComponent(
      new Transform({
        position: new Vector3(0.7, -0.165, -0.002),
        scale: new Vector3(0.1, 0.1, 0.1),
        rotation: Quaternion.Euler(0, 0, 0),
      })
    );

    // Terms and conditions
    this.termsAndConditionsText = new TextShape(
      "By proceeding to Commit, I agree to the"
    );
    this.termsAndConditionsText.color = Color3.Black();
    this.termsAndConditionsText.fontSize = 3.5;
    this.termsAndConditionsText.outlineColor = Color3.Black();
    this.termsAndConditionsText.outlineWidth = 0.25;
    this.termsAndConditionsText.hTextAlign = "left";
    this.termsAndConditionsEntity.addComponent(this.termsAndConditionsText);
    this.termsAndConditionsEntity.setParent(this.parent);
    this.termsAndConditionsEntity.addComponent(
      new Transform({
        position: new Vector3(0.21, -0.47, -0.002),
        scale: new Vector3(0.1, 0.1, 0.1),
        rotation: Quaternion.Euler(0, 0, 0),
      })
    );

    this.termsAndConditionsTextLink = new TextShape("Fair Exchange Policy");
    this.termsAndConditionsTextLink.color = Color3.Blue();
    this.termsAndConditionsTextLink.fontSize = 3.5;
    this.termsAndConditionsTextLink.outlineColor = Color3.Blue();
    this.termsAndConditionsTextLink.outlineWidth = 0.25;
    this.termsAndConditionsTextLink.hTextAlign = "left";
    this.termsAndConditionsEntityLink.addComponent(
      this.termsAndConditionsTextLink
    );
    this.termsAndConditionsEntityLink.setParent(this.parent);
    this.termsAndConditionsEntityLink.addComponent(
      new Transform({
        position: new Vector3(0.755, -0.47, -0.002),
        scale: new Vector3(0.1, 0.1, 0.1),
        rotation: Quaternion.Euler(0, 0, 0),
      })
    );

    this.termsAndConditionsClickBox.setParent(this.termsAndConditionsEntity);
    this.termsAndConditionsClickBox.addComponent(new PlaneShape());
    this.termsAndConditionsClickBox.addComponent(
      new Transform({
        position: new Vector3(6.8, 0, 0),
        scale: new Vector3(2.8, 0.75, 1),
      })
    );

    this.termsAndConditionsClickBox.addComponent(
      Kiosk.getAlphaMat() as Material
    );
    this.termsAndConditionsClickBox.addComponent(
      new OnPointerDown(
        () => {
          this.fairExchangePage.show();
          if (this.lockComponent != undefined) {
            this.lockComponent.hide();
          }
          // If product image was zoomed in, zoom it out
          if (this.productImage.hasComponent(this.productZoomOutPointer)) {
            this.ZoomOut();
          }
        },
        {
          hoverText: "Fair Exchange Policy",
        }
      )
    );

    this.termsAndConditionsClickBox2.setParent(this.parent);
    this.termsAndConditionsClickBox2.addComponent(new PlaneShape());
    this.termsAndConditionsClickBox2.addComponent(
      new Transform({
        position: new Vector3(0.91, -0.18, -0.0025),
        scale: new Vector3(0.47, 0.1, 1),
      })
    );

    this.termsAndConditionsClickBox2.addComponent(
      Kiosk.getAlphaMat() as Material
    );
    this.termsAndConditionsClickBox2.addComponent(
      new OnPointerDown(
        () => {
          this.fairExchangePage.show();
          if (this.lockComponent != undefined) {
            this.lockComponent.hide();
          }
          // If product image was zoomed in, zoom it out
          if (this.productImage.hasComponent(this.productZoomOutPointer)) {
            this.ZoomOut();
          }
        },
        {
          hoverText: "Fair Exchange Policy",
        }
      )
    );

    // Set up hovers
    this.redeemableHover = new QuestionMark(
      this.parent,
      new Transform({
        position: new Vector3(0.53 - 0.05, 0.08, -0.002),
        rotation: Quaternion.Euler(180, 180, 0),
        scale: new Vector3(0.05, 0.05, 0.1),
      }),
      "If you don’t redeem your rNFT during the redemption period, it will expire and you will receive\n back the price minus the Buyer cancellation penalty."
    );
    this.sellerDepositHover = new QuestionMark(
      this.parent,
      new Transform({
        position: new Vector3(0.45 - 0.05, -0.01, -0.002),
        rotation: Quaternion.Euler(180, 180, 0),
        scale: new Vector3(0.05, 0.05, 0.1),
      }),
      "The seller deposit is used to hold the seller accountable to follow through with their commitment to \n deliver the physical item. If the seller breaks their commitment, the deposit will be transferred to the buyer."
    );
    this.buyerCancelHover = new QuestionMark(
      this.parent,
      new Transform({
        position: new Vector3(0.53 - 0.05, -0.1, -0.002),
        rotation: Quaternion.Euler(180, 180, 0),
        scale: new Vector3(0.05, 0.05, 0.1),
      }),
      "If you fail to redeem your rNFT in time,\nyou will receive back the price minus the buyer cancellation penalty."
    );
    this.exchangeHover = new QuestionMark(
      this.parent,
      new Transform({
        position: new Vector3(0.5 - 0.05, -0.19, -0.002),
        rotation: Quaternion.Euler(180, 180, 0),
        scale: new Vector3(0.05, 0.05, 0.1),
      }),
      "The exchange policy ensures that the terms of sale are\n set in a fair way to protect both buyers and sellers."
    );
    this.disputeHover = new QuestionMark(
      this.parent,
      new Transform({
        position: new Vector3(0.5 - 0.05, -0.28, -0.002),
        rotation: Quaternion.Euler(180, 180, 0),
        scale: new Vector3(0.05, 0.05, 0.1),
      }),
      "The dispute resolver is trusted to resolve disputes\n between buyer and seller that can't be mutually resolved."
    );

    // Separators
    new Separator(
      this.parent,
      new Transform({
        position: new Vector3(0.65, 0.2, -0.002),
        rotation: Quaternion.Euler(180, 180, 0),
        scale: new Vector3(1.15, 0.007, 0.01),
      })
    );

    new Separator(
      this.parent,
      new Transform({
        position: new Vector3(0.65, -0.4, -0.002),
        rotation: Quaternion.Euler(180, 180, 0),
        scale: new Vector3(1.15, 0.007, 0.01),
      })
    );

    new Separator(
      this.parent,
      new Transform({
        position: new Vector3(0.65, -0.68, -0.002),
        rotation: Quaternion.Euler(180, 180, 0),
        scale: new Vector3(1.15, 0.003, 0.01),
      })
    );

    // Commit Button
    this.commitButtonEntity = new Entity();
    this.commitButtonEntity.addComponent(new PlaneShape());
    this.commitButtonEntity.setParent(this.parent);
    this.commitButtonEntity.addComponent(
      new Transform({
        position: new Vector3(0.4, -0.58, -0.002),
        rotation: Quaternion.Euler(180, 180, 0),
        scale: new Vector3(0.775 / 2, 0.224 / 2, 0.01),
      })
    );
    this.commitButtonEntity.addComponent(
      new OnPointerDown(
        () => {
          if (!this.commitLocked) {
            if (this.lockComponent != undefined) {
              this.lockComponent.hide();
            }
            this.processPage.show();
            // If product image was zoomed in, zoom it out
            if (this.productImage.hasComponent(this.productZoomOutPointer)) {
              this.ZoomOut();
            }
          }
        },
        {
          hoverText: "Commit",
        }
      )
    );

    this.commitButtonMat = new Material();
    this.commitButtonTexture = new Texture("images/kiosk/ui/commit.png", {
      hasAlpha: false,
    });
    this.commitButtonTextureLocked = new Texture(
      "images/kiosk/ui/commit_locked.png",
      {
        hasAlpha: false,
      }
    );

    this.commitButtonMat.albedoTexture = this.commitButtonTextureLocked;
    this.commitButtonMat.emissiveIntensity = 0.5;
    this.commitButtonMat.emissiveColor = Color3.White();
    this.commitButtonMat.emissiveTexture = this.commitButtonTextureLocked;
    this.commitButtonEntity.addComponent(this.commitButtonMat);

    // Cancel Button
    this.cancelButtonEntity = new Entity();
    this.cancelButtonEntity.addComponent(new PlaneShape());
    this.cancelButtonEntity.setParent(this.parent);
    this.cancelButtonEntity.addComponent(
      new Transform({
        position: new Vector3(0.9, -0.58, -0.002),
        rotation: Quaternion.Euler(180, 180, 0),
        scale: new Vector3(0.525 / 2, 0.224 / 2, 0.01),
      })
    );
    this.cancelButtonEntity.addComponent(
      new OnPointerDown(
        () => {
          // Close here
          this.hide();
          this.kiosk.uiOpen = false;
          this.kiosk.showDisplayProduct();
        },
        {
          hoverText: "Cancel",
        }
      )
    );

    this.cancelButtonMat = new Material();
    this.cancelButtonTexture = new Texture("images/kiosk/ui/cancel.png");

    this.cancelButtonMat.albedoTexture = this.cancelButtonTexture;
    this.cancelButtonMat.emissiveIntensity = 0.5;
    this.cancelButtonMat.emissiveColor = Color3.White();
    this.cancelButtonMat.emissiveTexture = this.cancelButtonTexture;
    this.cancelButtonEntity.addComponent(this.cancelButtonMat);

    // View Full Description
    this.productsRemainingText = new TextShape("");
    this.productsRemainingText.color = Color3.Black();
    this.productsRemainingText.fontSize = 4;
    this.productsRemainingText.outlineColor = Color3.Black();
    this.productsRemainingText.outlineWidth = 0.25;
    this.productsRemainingText.hTextAlign = "right";
    this.productsRemaining.addComponent(this.productsRemainingText);
    this.productsRemaining.setParent(this.parent);
    this.productsRemaining.addComponent(
      new Transform({
        position: new Vector3(1.2, 0.7, -0.002),
        scale: new Vector3(0.1, 0.1, 0.1),
        rotation: Quaternion.Euler(0, 0, 0),
      })
    );

    this.updateStock(
      this.productData.quantityInitial,
      this.productData.quantityAvailable
    );

    // Token gating
    if (this.kiosk.gatedTokens.length > 0) {
      this.tokenGatedOffer = new TokenGatedOffer(
        _kiosk,
        this.parent,
        new Transform({
          position: new Vector3(0.65, 0.22, -0.0008),
          scale: new Vector3(0.75, 0.75, 1),
        })
      );

      // Updated the token gated offer so it fits better on the product screen
      this.tokenGatedOffer.parent.getComponent(Transform).position.y -= 0.05;
      this.tokenGatedOffer.backgroundBox.getComponent(Transform).scale.x = 1.48;
      this.tokenGatedOffer.backgroundBox.getComponent(Transform).scale.y = 0.25;
      this.tokenGatedOffer.backgroundBox.getComponent(
        Transform
      ).position.y += 0.035;
      this.tokenGatedOffer.tokenGatedOfferTitle.getComponent(
        Transform
      ).position.y += 0.03;
      this.tokenGatedOffer.tokenGatedInfo.getComponent(
        Transform
      ).position.y += 0.03;

      this.tokenGatedOffer.requirementEntites.forEach((requirementEntity) => {
        requirementEntity.getComponent(Transform).position.y += 0.03;
      });

      this.tokenGatedOffer.tokenEntities.forEach((tokenEntity) => {
        tokenEntity.getComponent(Transform).position.y += 0.03;
      });

      this.lockComponent = new LockComponent(
        this.productData,
        this.parent,
        new Transform({
          position: new Vector3(0.3, 0.31, -0.002),
          rotation: Quaternion.Euler(180, 180, 0),
          scale: new Vector3(0.15 * 0.75, 0.15 * 0.75, 0.01),
        })
      );
    }

    let errorMessage = "";

    const tokenBalance: number = (ProductHandle.allBalances as any)[
      Helper.getCurrencySymbol(this.kiosk.productCurrency).toLocaleLowerCase()
    ];

    if (
      tokenBalance <
      (Helper.priceTransform(
        this.productData.price,
        tokenDecimals
      ) as unknown as number)
    ) {
      errorMessage = "Not enough funds in your wallet\nto Commit";
    } else {
      this.enoughFunds = true;
    }

    if (!this.kiosk.connectedToWeb3) {
      errorMessage = "Sign in to metamask to Commit";
    }

    // Locking on specific problems
    this.lockErrorNameText = new TextShape(errorMessage);
    this.lockErrorNameText.color = Color3.Black();
    this.lockErrorNameText.fontSize = 8;
    this.lockErrorNameText.hTextAlign = "left";
    this.lockErrorNameText.outlineColor = Color3.Black();
    this.lockErrorNameText.outlineWidth = 0.2;
    this.lockErrorNameText.vTextAlign = "top";
    this.lockErrorName.addComponent(this.lockErrorNameText);
    this.lockErrorName.setParent(this.parent);
    this.lockErrorName.addComponent(
      new Transform({
        position: new Vector3(0.63, -0.53, -0.002),
        scale: new Vector3(0.05, 0.05, 0.05),
        rotation: Quaternion.Euler(0, 0, 0),
      })
    );

    if (errorMessage.length > 0) {
      Helper.hideAllEntities([
        this.cancelButtonEntity, // Don't show cancel button as error messages use the same space
      ]);
    }

    this.setCommitLock(this.productData.quantityInitial);

    // artist name and logo
    this.artistNameText = new TextShape(
      Helper.addNewLinesInString(
        this.productData.metadata.product.productV1Seller.name,
        15,
        1
      )
    );
    this.artistNameText.color = Color3.Black();
    this.artistNameText.fontSize = 10;
    this.artistNameText.outlineColor = Color3.Black();
    this.artistNameText.outlineWidth = 0.1;
    this.artistNameText.hTextAlign = "left";
    this.artistName.addComponent(this.artistNameText);
    this.artistName.setParent(this.parent);
    this.artistName.addComponent(
      new Transform({
        position: new Vector3(-1.075 + 0.07, -0.72, -0.002),
        scale: new Vector3(0.05, 0.05, 0.05),
        rotation: Quaternion.Euler(0, 0, 0),
      })
    );

    this.artistLogoEntity.addComponent(new PlaneShape());
    this.artistLogoEntity.setParent(this.parent);
    this.artistLogoEntity.addComponent(
      new Transform({
        position: new Vector3(-1.163 + 0.07, -0.72, -0.002),
        rotation: Quaternion.Euler(180, 180, 0),
        scale: new Vector3(0.09, 0.09, 0.01),
      })
    );

    Helper.getIPFSImageTexture(
      (_productData.metadata.productV1Seller.images || []).find(
        (img: { tag: string }) => img.tag === "profile"
      )?.url
    )
      .then((texture: Texture) => {
        log("seller image loaded");
        this.artistLogoMat.albedoTexture = texture;
        this.artistLogoMat.emissiveIntensity = 1;
        this.artistLogoMat.emissiveColor = Color3.White();
        this.artistLogoMat.emissiveTexture = texture;
        this.artistLogoEntity.addComponent(this.artistLogoMat);
      })
      .catch((e) => {
        log("ERROR when loading seller image", e);
      });

    // Redeemeum Logo
    this.redeemeumLogoEntity.addComponent(new PlaneShape());
    this.redeemeumLogoEntity.setParent(this.parent);
    this.redeemeumLogoEntity.addComponent(
      new Transform({
        position: new Vector3(0.87, -0.28, -0.002),
        rotation: Quaternion.Euler(180, 180, 0),
        scale: new Vector3(0.6 / 1.75, 0.131 / 1.75, 0.01),
      })
    );

    this.redeemeumLogoTexture = new Texture(
      "images/kiosk/ui/redeemeum_logo.png",
      {
        hasAlpha: true,
      }
    );

    this.redeemeumLogoMat.albedoTexture = this.redeemeumLogoTexture;
    this.redeemeumLogoMat.transparencyMode = 2;
    this.redeemeumLogoMat.emissiveIntensity = 1;
    this.redeemeumLogoMat.emissiveColor = Color3.White();
    this.redeemeumLogoMat.emissiveTexture = this.redeemeumLogoTexture;
    this.redeemeumLogoEntity.addComponent(this.redeemeumLogoMat);

    // Add spring
    this.parent.addComponent(new ScaleSpringComponent(120, 10));

    this.hideWithoutSpring();
  }

  private showNextImage() {
    this.productImageIndex++;

    if (this.productImageIndex >= this.productTextures.length) {
      this.productImageIndex = this.productTextures.length - 1;
    }

    this.productImageMat.albedoTexture =
      this.productTextures[this.productImageIndex];
    this.productImageMat.emissiveTexture =
      this.productTextures[this.productImageIndex];
    this.calculateImageSize();
    this.setImageArrowVisibility();
  }

  private calculateImageSize() {
    if (
      this.productTextures[this.productImageIndex].src.indexOf(
        "waitingForImage"
      ) == -1
    ) {
      let height: number =
        this.productImage.getComponent(Transform).scale.x *
        this.productImageSizeRatios[this.productImageIndex];

      // Cap height
      if (height > 1.43) {
        height = 1.43;
      }
      this.productImage.getComponent(Transform).scale.y = height;
    } else {
      this.productImage.getComponent(Transform).scale.y =
        this.productImage.getComponent(Transform).scale.x;
    }

    // Calculate zoom button height
    this.productZoomEntity.getComponent(Transform).position.y =
      this.productImage.getComponent(Transform).scale.y / 2;
  }

  private showPreviousImage() {
    this.productImageIndex--;

    if (this.productImageIndex < 0) {
      this.productImageIndex = 0;
    }

    this.productImageMat.albedoTexture =
      this.productTextures[this.productImageIndex];
    this.productImageMat.emissiveTexture =
      this.productTextures[this.productImageIndex];
    this.calculateImageSize();
    this.setImageArrowVisibility();
  }

  private ZoomIn() {
    this.productImage.addComponentOrReplace(this.productZoomOutPointer);

    this.productImage.getComponent(Transform).scale = this.productImage
      .getComponent(Transform)
      .scale.multiply(new Vector3(2, 2, 2));
    this.productImage.getComponent(Transform).position = new Vector3(
      -0.2,
      0,
      -0.028
    );
    this.productZoomMat.albedoTexture = this.productZoomOutTexture;
    this.productZoomMat.emissiveTexture = this.productZoomOutTexture;

    Helper.hideAllEntities([
      this.productZoomEntity,
      this.productPrevImageEntity,
      this.productNextImageEntity,
      this.howItWorksLink,
    ]);
  }

  private ZoomOut() {
    if (this.productImage.hasComponent(this.productZoomOutPointer)) {
      this.productImage.removeComponent(this.productZoomOutPointer);
    }

    this.productImage.getComponent(Transform).scale = this.productImage
      .getComponent(Transform)
      .scale.multiply(new Vector3(0.5, 0.5, 0.5));
    (this.productImage.getComponent(Transform).position = new Vector3(
      -0.65,
      0.05,
      -0.0017
    )),
      (this.productZoomMat.albedoTexture = this.productZoomTexture);
    this.productZoomMat.emissiveTexture = this.productZoomTexture;

    engine.removeEntity(this.productImage);
    new DelayedTask(() => {
      engine.addEntity(this.productImage);
    }, 0.1);

    Helper.showAllEntities([this.productZoomEntity, this.howItWorksLink]);
    this.setImageArrowVisibility();
  }

  private setImageArrowVisibility() {
    if (this.productImageIndex == 0) {
      Helper.hideAllEntities([this.productPrevImageEntity]);
    } else {
      Helper.showAllEntities([this.productPrevImageEntity]);
    }

    if (this.productImageIndex == this.productTextures.length - 1) {
      Helper.hideAllEntities([this.productNextImageEntity]);
    } else {
      Helper.showAllEntities([this.productNextImageEntity]);
    }
  }

  public show() {
    Helper.showAllEntities([
      this.backgroundWidget,
      this.productImage,
      this.currencySymbolImage,
      this.productName,
      this.productPrice,
      this.greyBoxEntity,
      this.logoEntity,
      this.closeButtonEntity,
      this.whiteDetailsBox,
      this.underProductWhiteBox,
      this.viewFullDescription,
      this.viewFullDescriptionClickBox,
      this.redeemableHover,
      this.sellerDepositHover,
      this.buyerCancelHover,
      this.exchangeHover,
      this.disputeHover,
      this.productZoomEntity,
    ]);

    if (this.tokenGatedOffer != undefined) {
      this.tokenGatedOffer.show();
    }

    if (this.lockComponent != undefined) {
      this.lockComponent.show();
    }

    // If product image was zoomed in, zoom it out
    if (this.productImage.hasComponent(this.productZoomOutPointer)) {
      this.ZoomOut();
    }

    // Only show terms and conditions box, link and commit if the gating isn't locked
    // And is in stock
    let locked = false;

    if (this.kiosk.lockScreen?.lockComponent != undefined) {
      locked = this.kiosk.lockScreen?.lockComponent.locked;
    }

    if (!locked) {
      Helper.showAllEntities([
        this.termsAndConditionsEntity,
        this.commitButtonEntity,
        this.lockErrorName,
        this.termsAndConditionsEntityLink,
        this.termsAndConditionsClickBox,
      ]);
    } else {
      Helper.hideAllEntities([
        this.termsAndConditionsEntity,
        this.commitButtonEntity,
        this.lockErrorName,
        this.termsAndConditionsEntityLink,
        this.termsAndConditionsClickBox,
      ]);
    }

    this.setImageArrowVisibility();

    if (this.kiosk.variations.length > 0) {
      if (this.variationComponent == undefined) {
        this.variationComponent = new VariationComponent(
          this.kiosk,
          new Transform({
            position: new Vector3(0, 0, 0),
          }),
          this.parent
        );
      }
    }

    if (this.variationComponent != undefined) {
      this.variationComponent.show();
    }

    this.parent.getComponent(ScaleSpringComponent).targetScale = new Vector3(
      1,
      1,
      1
    );
  }

  public updateStock(_intialStock: number, _currentStock: number) {
    let productRemainingText = "";
    const remainingStockPercentage: number =
      Math.round(_currentStock / _intialStock) * 100;
    let productReaminingTextColor: Color3 = Color3.FromHexString("#FC6838"); // Orange
    const itemQuantity: number = _currentStock;

    if (remainingStockPercentage >= 50) {
      productRemainingText = _currentStock + "/" + _intialStock + " remaining";
    } else if (itemQuantity > 0) {
      productRemainingText = "Only " + _currentStock + " left!";
    } else {
      productRemainingText = "Sold Out!";
      productReaminingTextColor = Color3.Red();
    }

    if (this.productsRemainingText != undefined) {
      this.productsRemainingText.value = productRemainingText;
      this.productsRemainingText.color = productReaminingTextColor;
      this.productsRemainingText.outlineColor = productReaminingTextColor;
    }

    this.productDescriptionPage.updateStock(_intialStock, _currentStock);

    // See if changes to stock effect the commit lock
    this.setCommitLock(_currentStock);
  }

  public hideWithoutSpring() {
    Helper.hideAllEntities([
      this.backgroundWidget,
      this.productImage,
      this.currencySymbolImage,
      this.productName,
      this.productPrice,
      this.greyBoxEntity,
      this.logoEntity,
      this.closeButtonEntity,
      this.whiteDetailsBox,
      this.underProductWhiteBox,
      this.viewFullDescription,
      this.viewFullDescriptionClickBox,
      this.redeemableHover,
      this.sellerDepositHover,
      this.buyerCancelHover,
      this.exchangeHover,
      this.disputeHover,
      this.productPrevImageEntity,
      this.productNextImageEntity,
      this.productZoomEntity,
    ]);
    if (this.tokenGatedOffer != undefined) {
      this.tokenGatedOffer.hide();
    }
    this.productDescriptionPage.hide();
  }

  public setCommitLock(_currentStock: number) {
    if (this.kiosk.connectedToWeb3 && this.enoughFunds) {
      this.commitLocked = false;
      this.commitButtonMat.albedoTexture = this.commitButtonTexture;
      this.commitButtonMat.emissiveTexture = this.commitButtonTexture;
    } else {
      this.commitLocked = true;
      this.commitButtonMat.albedoTexture = this.commitButtonTextureLocked;
      this.commitButtonMat.emissiveTexture = this.commitButtonTextureLocked;
    }

    if (_currentStock < 1 && !this.commitLocked) {
      this.commitLocked = true;
    }

    if (
      _currentStock > 0 &&
      this.commitLocked &&
      this.kiosk.connectedToWeb3 &&
      this.enoughFunds
    ) {
      this.commitLocked = false;
    }
  }

  public hide() {
    new DelayedTask(() => {
      this.hideWithoutSpring();
      if (this.processPage.completePage != undefined) {
        this.processPage.completePage.hide();
      }
    }, 1);

    this.parent.getComponent(ScaleSpringComponent).targetScale = new Vector3(
      0,
      0,
      0
    );
  }
}
