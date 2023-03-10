import { ScaleSpringComponent } from "../animation/ScaleSpringComponent"
import { DescriptionPage } from "./descriptionPage"
import { Helper } from "../helper"
import { Kiosk } from "../kiosk"
import { ProcessPage } from "./processPage"
import { DelayedTask } from "../tasks/DelayedTask"
import { CheckBox } from "../UIComponents/checkBox"
import { HowItWorksLink } from "../UIComponents/howItWorksLink"
import { QuestionMark } from "../UIComponents/questionMark"
import { Separator } from "../UIComponents/separator"
import { eCurrency } from "../enums"
import { TokenGatedOffer } from "../UIComponents/tokenGatedOffer"
import { LockComponent } from "../UIComponents/lockComponent"
import { VariationComponent } from "../UIComponents/variationComponent"
import { CoreSDK } from "../../.."
import { FairExchangePolicyPage } from "./fairExchangePolicyPage"

export class ProductPage {
    private _coreSdk: CoreSDK
    private _userAccount: string

    kiosk: Kiosk

    productData: any = undefined

    parent: Entity

    backgroundWidget: Entity = new Entity()
    backGroundMat: Material = new Material()
    backGroundTexture: Texture

    productImage: Entity = new Entity()
    productImageMat: Material = new Material()
    productTextures: Texture[] = []
    productImageSizeRatios: number[] = []

    productImageIndex: number = 0

    currencySymbolImage: Entity = new Entity()
    currencySymbolMat: Material = new Material()

    // Image controls

    productPrevImageEntity: Entity = new Entity()
    productPrevImageMat: Material = new Material()
    productPrevImageTexture: Texture

    productNextImageEntity: Entity = new Entity()
    productNextImageMat: Material = new Material()
    productNextImageTexture: Texture

    productZoomEntity: Entity = new Entity()
    productZoomMat: Material = new Material()
    productZoomTexture: Texture
    productZoomOutTexture: Texture
    productZoomPointer: OnPointerDown
    productZoomOutPointer: OnPointerDown

    public productName: Entity = new Entity()
    productNameText: TextShape

    productPrice: Entity = new Entity()
    productPriceText: TextShape
    productDollarPrice: Entity = new Entity()
    productDollarPriceText: TextShape

    greyBoxEntity: Entity = new Entity()
    greyBoxMat: Material = new Material()

    logoEntity: Entity = new Entity()
    logoMat: Material = new Material()
    logoTexture: Texture

    closeButtonEntity: Entity = new Entity()
    closeButtonMat: Material = new Material()
    closeButtonTexture: Texture

    whiteDetailsBox: Entity = new Entity()
    whiteDetailsMat: Material = new Material()

    underProductWhiteBox: Entity = new Entity()
    underProductWhiteMat: Material = new Material()

    viewFullDescription: Entity = new Entity()
    viewFullDescriptionText: TextShape
    viewFullDescriptionClickBox: Entity = new Entity()

    howItWorksLink: Entity

    // Information Section
    informationSectionEntity: Entity = new Entity()
    informationSectionText: TextShape | undefined

    informationSectionDataEntity: Entity = new Entity()
    informationSectionDataText: TextShape | undefined

    // Pages
    productDescriptionPage: DescriptionPage
    processPage: ProcessPage
    fairExchangePage: FairExchangePolicyPage

    termsAndConditionsEntity: Entity = new Entity()
    termsAndConditionsText: TextShape | undefined
    termsAndConditionsClickBox: Entity = new Entity()
    termsAndConditionsClickBox2: Entity = new Entity()

    // Hovers
    redeemableHover: QuestionMark
    sellerDepositHover: QuestionMark
    buyerCancelHover: QuestionMark
    exchangeHover: QuestionMark
    disputeHover: QuestionMark

    // Proceed button
    commitButtonEntity: Entity = new Entity()
    commitButtonMat: Material = new Material()
    commitButtonTexture: Texture | undefined
    commitButtonTextureLocked: Texture | undefined
    commitLocked: boolean = true

    // Products remaining
    productsRemaining: Entity = new Entity()
    productsRemainingText: TextShape | undefined

    // Locking
    tokenGatedOffer: TokenGatedOffer | undefined
    public lockComponent: LockComponent | undefined

    // Variation options
    variationComponent: VariationComponent | undefined

    // Locking when not web3 or dont have enough funds
    lockErrorName: Entity = new Entity()
    lockErrorNameText: TextShape | undefined

    // Artist name
    artistName: Entity = new Entity()
    artistNameText: TextShape | undefined

    // Artist logo
    artistLogoEntity: Entity = new Entity()
    artistLogoMat: Material = new Material()
    artistLogoTexture: Texture


    enoughFunds: boolean = false


    constructor(coreSDK: CoreSDK, userAccount: string, _kiosk: Kiosk, _productData: any) {
        this._coreSdk = coreSDK
        this._userAccount = userAccount

        this.productData = _productData

        this.kiosk = _kiosk
        this.parent = new Entity()
        this.parent.setParent(_kiosk.parent)
        this.parent.addComponent(new Transform({
            position: new Vector3(0, 2, 0),
            scale: new Vector3(0, 0, 0)
        }))

        this.productDescriptionPage = new DescriptionPage(this.kiosk, this.parent, _productData)
        this.processPage = new ProcessPage(this._coreSdk, this._userAccount, this.kiosk, this.parent, _productData)
        this.fairExchangePage = new FairExchangePolicyPage(this.kiosk,this.parent, _productData)

        // Background widget
        this.backgroundWidget = new Entity()
        this.backgroundWidget.addComponent(new PlaneShape())
        this.backgroundWidget.setParent(this.parent)
        this.backgroundWidget.addComponent(new Transform({
            position: new Vector3(0, 0, 0),
            rotation: Quaternion.Euler(0, 0, 0),
            scale: new Vector3(2.6, 2.1, 2),
        }))

        this.backGroundMat = new Material()
        this.backGroundTexture = new Texture("images/UI/widget_background_white.png", { hasAlpha: true })

        this.backGroundMat.albedoTexture = this.backGroundTexture
        this.backGroundMat.emissiveIntensity = 1
        this.backGroundMat.emissiveColor = Color3.White()
        this.backGroundMat.emissiveTexture = this.backGroundTexture
        this.backGroundMat.transparencyMode = 1
        this.backgroundWidget.addComponent(this.backGroundMat)

        this.productImage.addComponent(new PlaneShape())
        this.productImage.setParent(this.parent)
        this.productImage.addComponent(new Transform({
            position: new Vector3(-0.65, 0.05, -0.0015),
            rotation: Quaternion.Euler(180, 180, 0),
            scale: new Vector3(1.6 / 1.4, 2 / 1.4, 0.01),
        }))

        this.productImageMat = new Material()

        if (this.productData.metadata.product.visuals_images.length > 0) {
            this.productData.metadata.product.visuals_images.forEach((image: { url: string, width: number, height: number }) => {
                this.productTextures.push(Helper.getIPFSImageTexture(image.url))
                this.productImageSizeRatios.push(image.height / image.width)
            });
        }

        this.productImageMat.albedoTexture = this.productTextures[this.productImageIndex]
        //this.productImageMat.transparencyMode = 1
        this.productImageMat.emissiveIntensity = 1
        this.productImageMat.emissiveColor = Color3.White()
        this.productImageMat.emissiveTexture = this.productTextures[this.productImageIndex]
        this.productImage.addComponent(this.productImageMat)

        this.productNameText = new TextShape(this.productData.metadata.product.title)
        this.productNameText.color = Color3.Black()
        this.productNameText.fontSize = 20
        this.productNameText.hTextAlign = "left"
        this.productName.addComponent(this.productNameText)
        this.productName.setParent(this.parent)
        this.productName.addComponent(new Transform({
            position: new Vector3(-1, 0.95, -0.002),
            scale: new Vector3(0.05, 0.05, 0.05),
            rotation: Quaternion.Euler(0, 0, 0)
        }))


        this.productPriceText = new TextShape(Helper.priceTransform(this.productData.price))
        this.productPriceText.color = Color3.Black()
        this.productPriceText.fontSize = 20
        this.productPriceText.hTextAlign = "left"
        this.productPrice.addComponent(this.productPriceText)
        this.productPrice.setParent(this.parent)
        this.productPrice.addComponent(new Transform({
            position: new Vector3(0.22, 0.7, -0.002),
            scale: new Vector3(0.05, 0.05, 0.05),
            rotation: Quaternion.Euler(0, 0, 0)
        }))

        this.productDollarPriceText = new TextShape("($ Loading...)")
        this.productDollarPriceText.color = Color3.Black()
        this.productDollarPriceText.fontSize = 10
        this.productDollarPriceText.hTextAlign = "left"
        this.productDollarPriceText.outlineColor = Color3.Black()
        this.productDollarPriceText.outlineWidth = 0.2
        this.productDollarPrice.addComponent(this.productDollarPriceText)
        this.productDollarPrice.setParent(this.parent)
        this.productDollarPrice.addComponent(new Transform({
            position: new Vector3(0.23, 0.62, -0.002),
            scale: new Vector3(0.05, 0.05, 0.05),
            rotation: Quaternion.Euler(0, 0, 0)
        }))

        this.currencySymbolImage.addComponent(new PlaneShape())
        this.currencySymbolImage.setParent(this.parent)
        this.currencySymbolImage.addComponent(new Transform({
            position: new Vector3(0.14, 0.7, -0.002),
            rotation: Quaternion.Euler(180, 180, 0),
            scale: new Vector3(0.1, 0.1, 0.01),
        }))

        // Add currency name to the hover text
        this.currencySymbolImage.addComponent(new OnPointerDown(() => {
            // Intentionally left empty
        }, { hoverText: Helper.getCurrencyLabel(this.kiosk.productCurrency) }))

        this.currencySymbolMat = new Material()
        this.currencySymbolMat.albedoTexture = Helper.getCurrencyTexture(this.kiosk.productCurrency)
        this.currencySymbolMat.emissiveIntensity = 1
        this.currencySymbolMat.emissiveColor = Color3.White()
        this.currencySymbolMat.emissiveTexture = Helper.getCurrencyTexture(this.kiosk.productCurrency)
        this.currencySymbolMat.transparencyMode = 2
        this.currencySymbolImage.addComponent(this.currencySymbolMat)

        // Grey Box
        this.greyBoxEntity = new Entity()
        this.greyBoxEntity.addComponent(new PlaneShape())
        this.greyBoxEntity.setParent(this.parent)
        this.greyBoxEntity.addComponent(new Transform({
            position: new Vector3(0, 0, -0.001),
            rotation: Quaternion.Euler(180, 180, 0),
            scale: new Vector3(2.6, 1.72, 0.01),
        }))
        this.greyBoxMat = new Material()
        this.greyBoxMat.emissiveIntensity = 1
        this.greyBoxMat.emissiveColor = Color3.Gray()
        this.greyBoxEntity.addComponent(this.greyBoxMat)

        // Boson Logo
        this.logoEntity = new Entity()
        this.logoEntity.addComponent(new PlaneShape())
        this.logoEntity.setParent(this.parent)
        this.logoEntity.addComponent(new Transform({
            position: new Vector3(0, -0.95, -0.002),
            rotation: Quaternion.Euler(180, 180, 0),
            scale: new Vector3(0.435, 0.103, 0.01),
        }))

        this.logoMat = new Material()
        this.logoTexture = new Texture("images/UI/bosonLogoBlack.png", { hasAlpha: true })

        this.logoMat.albedoTexture = this.logoTexture
        this.logoMat.emissiveIntensity = 1
        this.logoMat.emissiveColor = Color3.White()
        this.logoMat.emissiveTexture = this.logoTexture
        this.logoMat.transparencyMode = 1
        this.logoEntity.addComponent(this.logoMat)

        // Image controls

        this.productPrevImageEntity = new Entity()
        this.productPrevImageEntity.addComponent(new PlaneShape())
        this.productPrevImageEntity.setParent(this.productImage)
        this.productPrevImageEntity.addComponent(new Transform({
            position: new Vector3(0.45, 0, -0.1),
            rotation: Quaternion.Euler(0, 0, 0),
            scale: new Vector3(0.12, 0.1, 0.01),
        }))
        this.productPrevImageEntity.addComponent(new OnPointerDown(() => {
            this.showPreviousImage()
        }, {
            hoverText: "Previous Image"
        }))

        this.productPrevImageMat = new Material()
        this.productPrevImageTexture = new Texture("images/UI/prevImage.png", { hasAlpha: true })

        this.productPrevImageMat.albedoTexture = this.productPrevImageTexture
        this.productPrevImageMat.emissiveIntensity = 1
        this.productPrevImageMat.emissiveColor = Color3.White()
        this.productPrevImageMat.emissiveTexture = this.productPrevImageTexture
        this.productPrevImageMat.transparencyMode = 1
        this.productPrevImageEntity.addComponent(this.productPrevImageMat)

        this.productNextImageEntity = new Entity()
        this.productNextImageEntity.addComponent(new PlaneShape())
        this.productNextImageEntity.setParent(this.productImage)
        this.productNextImageEntity.addComponent(new Transform({
            position: new Vector3(-0.45, 0, -0.1),
            rotation: Quaternion.Euler(0, 0, 0),
            scale: new Vector3(0.12, 0.1, 0.01),
        }))
        this.productNextImageEntity.addComponent(new OnPointerDown(() => {
            this.showNextImage()
        }, {
            hoverText: "Next Image"
        }))

        this.productNextImageMat = new Material()
        this.productNextImageTexture = new Texture("images/UI/nextImage.png", { hasAlpha: true })

        this.productNextImageMat.albedoTexture = this.productNextImageTexture
        this.productNextImageMat.emissiveIntensity = 1
        this.productNextImageMat.emissiveColor = Color3.White()
        this.productNextImageMat.emissiveTexture = this.productNextImageTexture
        this.productNextImageMat.transparencyMode = 1
        this.productNextImageEntity.addComponent(this.productNextImageMat)

        this.productZoomPointer = new OnPointerDown(() => {
            this.ZoomIn()
        }, {
            hoverText: "Zoom in"
        })

        this.productZoomOutPointer = new OnPointerDown(() => {
            this.ZoomOut()
        }, {
            hoverText: "Zoom out"
        })

        this.productZoomEntity = new Entity()
        this.productZoomEntity.addComponent(new PlaneShape())
        this.productZoomEntity.setParent(this.productImage)
        this.productZoomEntity.addComponent(new Transform({
            position: new Vector3(0.4, -0.42, -0.1),
            rotation: Quaternion.Euler(0, 0, 0),
            scale: new Vector3(0.12, 0.1, 0.01),
        }))
        this.productZoomEntity.addComponent(this.productZoomPointer)

        this.productZoomMat = new Material()
        this.productZoomTexture = new Texture("images/UI/productZoom.png", { hasAlpha: true })
        this.productZoomOutTexture = new Texture("images/UI/productZoomOut.png", { hasAlpha: true })

        this.productZoomMat.albedoTexture = this.productZoomTexture
        this.productZoomMat.emissiveIntensity = 1
        this.productZoomMat.emissiveColor = Color3.White()
        this.productZoomMat.emissiveTexture = this.productZoomTexture
        this.productZoomMat.transparencyMode = 1
        this.productZoomEntity.addComponent(this.productZoomMat)

        // Close Button
        this.closeButtonEntity = new Entity()
        this.closeButtonEntity.addComponent(new PlaneShape())
        this.closeButtonEntity.setParent(this.parent)
        this.closeButtonEntity.addComponent(new Transform({
            position: new Vector3(1.19, 0.95, -0.002),
            rotation: Quaternion.Euler(180, 180, 0),
            scale: new Vector3(0.07, 0.07, 0.01),
        }))
        this.closeButtonEntity.addComponent(new OnPointerDown(() => {
            this.hide()
            this.kiosk.uiOpen = false
            this.kiosk.showDisplayProduct()
        }, {
            hoverText: "Close"
        }))

        this.closeButtonMat = new Material()
        this.closeButtonTexture = new Texture("images/UI/closeBtnDark.png", { hasAlpha: true })

        this.closeButtonMat.albedoTexture = this.closeButtonTexture
        this.closeButtonMat.emissiveIntensity = 0.5
        this.closeButtonMat.emissiveColor = Color3.White()
        this.closeButtonMat.emissiveTexture = this.closeButtonTexture
        this.closeButtonMat.transparencyMode = 2
        this.closeButtonEntity.addComponent(this.closeButtonMat)

        // White Details Box
        this.whiteDetailsBox = new Entity()
        this.whiteDetailsBox.addComponent(new PlaneShape())
        this.whiteDetailsBox.setParent(this.parent)
        this.whiteDetailsBox.addComponent(new Transform({
            position: new Vector3(0.65, 0, -0.0015),
            rotation: Quaternion.Euler(180, 180, 0),
            scale: new Vector3(1.6 / 1.4, (2 / 1.4) + 0.1, 0.01),
        }))
        this.whiteDetailsMat = new Material()
        this.whiteDetailsMat.emissiveIntensity = 1
        this.whiteDetailsMat.emissiveColor = Color3.White()
        this.whiteDetailsBox.addComponent(this.whiteDetailsMat)

        // Under Product White Box
        this.underProductWhiteBox = new Entity()
        this.underProductWhiteBox.addComponent(new PlaneShape())
        this.underProductWhiteBox.setParent(this.parent)
        this.underProductWhiteBox.addComponent(new Transform({
            position: new Vector3(-0.65, -0.72, -0.0015),
            rotation: Quaternion.Euler(180, 180, 0),
            scale: new Vector3(1.6 / 1.4, 0.1, 0.01),
        }))
        this.underProductWhiteMat = new Material()
        this.underProductWhiteMat.emissiveIntensity = 1
        this.underProductWhiteMat.emissiveColor = Color3.White()
        this.underProductWhiteBox.addComponent(this.underProductWhiteMat)

        // View Full Description
        this.viewFullDescriptionText = new TextShape("View Full Description")
        this.viewFullDescriptionText.color = Color3.Purple()
        this.viewFullDescriptionText.fontSize = 4
        this.viewFullDescriptionText.outlineColor = Color3.Purple()
        this.viewFullDescriptionText.outlineWidth = 0.25
        this.viewFullDescription.addComponent(this.viewFullDescriptionText)
        this.viewFullDescription.setParent(this.parent)
        this.viewFullDescription.addComponent(new Transform({
            position: new Vector3(-0.35, -0.72, -0.002),
            scale: new Vector3(0.1, 0.1, 0.1),
            rotation: Quaternion.Euler(0, 0, 0)
        }))

        this.viewFullDescriptionClickBox.setParent(this.viewFullDescription)
        this.viewFullDescriptionClickBox.addComponent(new PlaneShape())
        this.viewFullDescriptionClickBox.addComponent(new Transform({
            scale: new Vector3(4, 1, 1)
        }))

        this.viewFullDescriptionClickBox.addComponent(Kiosk.alphaMat as Material)
        this.viewFullDescriptionClickBox.addComponent(new OnPointerDown(() => {
            this.productDescriptionPage.show()
            if (this.lockComponent != undefined) {
                this.lockComponent.hide()
            }
        }, {
            hoverText: "View Full Description"
        }))

        // How It Works
        this.howItWorksLink = new HowItWorksLink(
            this.kiosk,
            this.parent,
            new Transform({
                position: new Vector3(0.65, -0.72, -0.002),
                scale: new Vector3(0.1, 0.1, 0.1),
                rotation: Quaternion.Euler(0, 0, 0)
            })
        )

        // Information Section
        this.informationSectionText =
            new TextShape("Redeemable\n\nSeller deposit\n\nBuyer cancel.pen.\n\nExchange policy\n\nDispute resolver")
        this.informationSectionText.color = Color3.Black()
        this.informationSectionText.fontSize = 4
        this.informationSectionText.outlineColor = Color3.Black()
        this.informationSectionText.outlineWidth = 0.1
        this.informationSectionText.hTextAlign = "left"
        this.informationSectionEntity.addComponent(this.informationSectionText)
        this.informationSectionEntity.setParent(this.parent)
        this.informationSectionEntity.addComponent(new Transform({
            position: new Vector3(0.12, -0.1, -0.002),
            scale: new Vector3(0.1, 0.1, 0.1),
            rotation: Quaternion.Euler(0, 0, 0)
        }))

        let redeemableUntilDate: number = this.productData.voucherRedeemableUntilDate * 1000
        let sellerDeposit: string = this.productData.sellerDeposit
        let buyerCancelPenalty: string = this.productData.buyerCancelPenalty
        let exchangePolicy: string = "Fair Exchange Policy"
        let disputeResolver: string = "PORTAL"

        this.informationSectionDataText =
            new TextShape(new Date(redeemableUntilDate).toLocaleDateString() + "\n\n" +
                Helper.priceTransform(sellerDeposit) + " " + Helper.getCurrencySymbol(this.kiosk.productCurrency).toUpperCase() + " (" + Math.round(((this.productData.sellerDeposit as number)/(this.productData.price as number)*100)) + "%)"  + "\n\n" +
                Helper.priceTransform(buyerCancelPenalty) + " " + Helper.getCurrencySymbol(this.kiosk.productCurrency).toUpperCase() + " (" + Math.round(((this.productData.buyerCancelPenalty as number)/(this.productData.price as number)*100)) + "%)" + "\n\n" +
                exchangePolicy + "\n\n" +
                disputeResolver)
        this.informationSectionDataText.color = Color3.Black()
        this.informationSectionDataText.fontSize = 4
        this.informationSectionDataText.outlineColor = Color3.Black()
        this.informationSectionDataText.outlineWidth = 0.1
        this.informationSectionDataText.hTextAlign = "left"
        this.informationSectionDataEntity.addComponent(this.informationSectionDataText)
        this.informationSectionDataEntity.setParent(this.parent)
        this.informationSectionDataEntity.addComponent(new Transform({
            position: new Vector3(0.7, -0.1, -0.002),
            scale: new Vector3(0.1, 0.1, 0.1),
            rotation: Quaternion.Euler(0, 0, 0)
        }))

        // Terms and conditions
        this.termsAndConditionsText = new TextShape("By proceeding to Commit, I agree to the Fair Exchange Policy")
        this.termsAndConditionsText.color = Color3.Purple()
        this.termsAndConditionsText.fontSize = 3.5
        this.termsAndConditionsText.outlineColor = Color3.Purple()
        this.termsAndConditionsText.outlineWidth = 0.25
        this.termsAndConditionsText.hTextAlign = "left"
        this.termsAndConditionsEntity.addComponent(this.termsAndConditionsText)
        this.termsAndConditionsEntity.setParent(this.parent)
        this.termsAndConditionsEntity.addComponent(new Transform({
            position: new Vector3(0.15, -0.47, -0.002),
            scale: new Vector3(0.1, 0.1, 0.1),
            rotation: Quaternion.Euler(0, 0, 0)
        }))

        this.termsAndConditionsClickBox.setParent(this.termsAndConditionsEntity)
        this.termsAndConditionsClickBox.addComponent(new PlaneShape())
        this.termsAndConditionsClickBox.addComponent(new Transform({
            position: new Vector3(6.8, 0, 0),
            scale: new Vector3(2.8, 0.75, 1)
        }))

        this.termsAndConditionsClickBox.addComponent(Kiosk.alphaMat as Material)
        this.termsAndConditionsClickBox.addComponent(new OnPointerDown(() => {
            this.fairExchangePage.show()
            if (this.lockComponent != undefined) {
                this.lockComponent.hide()
            }
        }, {
            hoverText: "Fair Exchange Policy"
        }))

        this.termsAndConditionsClickBox2.setParent(this.parent)
        this.termsAndConditionsClickBox2.addComponent(new PlaneShape())
        this.termsAndConditionsClickBox2.addComponent(new Transform({
            position: new Vector3(0.94, -0.22, -0.0025),
            scale: new Vector3(0.47, 0.1, 1)
        }))

        this.termsAndConditionsClickBox2.addComponent(Kiosk.alphaMat as Material)
        this.termsAndConditionsClickBox2.addComponent(new OnPointerDown(() => {
            this.fairExchangePage.show()
            if (this.lockComponent != undefined) {
                this.lockComponent.hide()
            }
        }, {
            hoverText: "Fair Exchange Policy"
        }))

        // Set up hovers
        this.redeemableHover = new QuestionMark(this.parent, new Transform({
            position: new Vector3(0.43, 0.08, -0.002),
            rotation: Quaternion.Euler(180, 180, 0),
            scale: new Vector3(0.05, 0.05, 0.1)
        }), "If you don’t redeem your rNFT during the redemption period, it will expire and you will receive\n back the price minus the Buyer cancellation penalty.")
        this.sellerDepositHover = new QuestionMark(this.parent, new Transform({
            position: new Vector3(0.45, -0.01, -0.002),
            rotation: Quaternion.Euler(180, 180, 0),
            scale: new Vector3(0.05, 0.05, 0.1)
        }), "The seller deposit is used to hold the seller accountable to follow through with their commitment to \n deliver the physical item. If the seller breaks their commitment, the deposit will be transferred to the buyer.")
        this.buyerCancelHover = new QuestionMark(this.parent, new Transform({
            position: new Vector3(0.53, -0.1, -0.002),
            rotation: Quaternion.Euler(180, 180, 0),
            scale: new Vector3(0.05, 0.05, 0.1)
        }), "If you fail to redeem your rNFT in time,\nyou will receive back the price minus the buyer cancellation penalty.")
        this.exchangeHover = new QuestionMark(this.parent, new Transform({
            position: new Vector3(0.50, -0.19, -0.002),
            rotation: Quaternion.Euler(180, 180, 0),
            scale: new Vector3(0.05, 0.05, 0.1)
        }), "The exchange policy ensures that the terms of sale are\n set in a fair way to protect both buyers and sellers.")
        this.disputeHover = new QuestionMark(this.parent, new Transform({
            position: new Vector3(0.50, -0.28, -0.002),
            rotation: Quaternion.Euler(180, 180, 0),
            scale: new Vector3(0.05, 0.05, 0.1)
        }), "The dispute resolver is trusted to resolve disputes\n between buyer and seller that can't be mutually resolved.")

        // Separators
        new Separator(this.parent,
            new Transform({
                position: new Vector3(0.65, 0.2, -0.002),
                rotation: Quaternion.Euler(180, 180, 0),
                scale: new Vector3(1.15, 0.007, 0.01)
            })
        )

        new Separator(this.parent,
            new Transform({
                position: new Vector3(0.65, -0.4, -0.002),
                rotation: Quaternion.Euler(180, 180, 0),
                scale: new Vector3(1.15, 0.007, 0.01)
            })
        )

        new Separator(this.parent,
            new Transform({
                position: new Vector3(0.65, -0.68, -0.002),
                rotation: Quaternion.Euler(180, 180, 0),
                scale: new Vector3(1.15, 0.003, 0.01)
            })
        )

        // Commit Button
        this.commitButtonEntity = new Entity()
        this.commitButtonEntity.addComponent(new PlaneShape())
        this.commitButtonEntity.setParent(this.parent)
        this.commitButtonEntity.addComponent(new Transform({
            position: new Vector3(0.4, -0.58, -0.002),
            rotation: Quaternion.Euler(180, 180, 0),
            scale: new Vector3(0.775 / 2, 0.224 / 2, 0.01),
        }))
        this.commitButtonEntity.addComponent(new OnPointerDown(() => {
            if (!this.commitLocked) {
                if (this.lockComponent != undefined) {
                    this.lockComponent.hide()
                }
                this.processPage.show()
            }
        }, {
            hoverText: "Commit"
        }))

        this.commitButtonMat = new Material()
        this.commitButtonTexture = new Texture("images/UI/Commit.png", { hasAlpha: false })
        this.commitButtonTextureLocked = new Texture("images/UI/CommitLocked.png", { hasAlpha: false })

        this.commitButtonMat.albedoTexture = this.commitButtonTextureLocked
        this.commitButtonMat.emissiveIntensity = 0.5
        this.commitButtonMat.emissiveColor = Color3.White()
        this.commitButtonMat.emissiveTexture = this.commitButtonTextureLocked
        this.commitButtonEntity.addComponent(this.commitButtonMat)

   
        // View Full Description
        this.productsRemainingText = new TextShape("")
        this.productsRemainingText.color = Color3.Black()
        this.productsRemainingText.fontSize = 6
        this.productsRemainingText.outlineColor = Color3.Black()
        this.productsRemainingText.outlineWidth = 0.25
        this.productsRemainingText.hTextAlign = "right"
        this.productsRemaining.addComponent(this.productsRemainingText)
        this.productsRemaining.setParent(this.parent)
        this.productsRemaining.addComponent(new Transform({
            position: new Vector3(1.2, 0.7, -0.002),
            scale: new Vector3(0.1, 0.1, 0.1),
            rotation: Quaternion.Euler(0, 0, 0)
        }))

        this.updateStock(this.productData.quantityInitial, this.productData.quantityAvailable)

        // Token gating 
        if (this.kiosk.gatedTokens.length > 0) {
            this.tokenGatedOffer = new TokenGatedOffer(_kiosk, this.parent, new Transform({
                position: new Vector3(0.65, 0.22, -0.0008),
                scale: new Vector3(0.75, 0.75, 1)
            }))

            // Updated the token gated offer so it fits better on the product screen
            this.tokenGatedOffer.parent.getComponent(Transform).position.y -= 0.05
            this.tokenGatedOffer.backgroundBox.getComponent(Transform).scale.x = 1.48
            this.tokenGatedOffer.backgroundBox.getComponent(Transform).scale.y = 0.25
            this.tokenGatedOffer.backgroundBox.getComponent(Transform).position.y += 0.035
            this.tokenGatedOffer.tokenGatedOfferTitle.getComponent(Transform).position.y += 0.03
            this.tokenGatedOffer.tokenGatedInfo.getComponent(Transform).position.y += 0.03

            this.tokenGatedOffer.requirementEntites.forEach(requirementEntity => {
                requirementEntity.getComponent(Transform).position.y += 0.03
            });

            this.tokenGatedOffer.tokenEntities.forEach(tokenEntity => {
                tokenEntity.getComponent(Transform).position.y += 0.03
            });

            this.lockComponent = new LockComponent(this.productData, this.parent, new Transform({
                position: new Vector3(0.3, 0.31, -0.002),
                rotation: Quaternion.Euler(180, 180, 0),
                scale: new Vector3(0.15 * 0.75, 0.15 * 0.75, 0.01),
            }))
        }

        let errorMessage: string = ""
    

        let tokenBalance: number = (Kiosk.allBalances as any)[Helper.getCurrencySymbol(this.kiosk.productCurrency).toLocaleLowerCase()]

        if (tokenBalance < (Helper.priceTransform(this.productData.price) as unknown as number)) {
            errorMessage = "Not enough funds in your wallet\nto Commit"
        } else {
            this.enoughFunds = true
        }

        if (!this.kiosk.connecectedToWeb3) {
            errorMessage = "Sign in to metamask to Commit"
        }

        // Locking on specific problems
        this.lockErrorNameText = new TextShape(errorMessage)
        this.lockErrorNameText.color = Color3.Black()
        this.lockErrorNameText.fontSize = 8
        this.lockErrorNameText.hTextAlign = "left"
        this.lockErrorNameText.outlineColor = Color3.Black()
        this.lockErrorNameText.outlineWidth = 0.2
        this.lockErrorNameText.vTextAlign = "top"
        this.lockErrorName.addComponent(this.lockErrorNameText)
        this.lockErrorName.setParent(this.parent)
        this.lockErrorName.addComponent(new Transform({
            position: new Vector3(0.63, -0.53, -0.002),
            scale: new Vector3(0.05, 0.05, 0.05),
            rotation: Quaternion.Euler(0, 0, 0)
        }))

        this.setCommitLock(this.productData.quantityInitial)

        // artist name and logo
        this.artistNameText = new TextShape(this.productData.metadata.product.productV1Seller.name)
        this.artistNameText.color = Color3.Black()
        this.artistNameText.fontSize = 10
        this.artistNameText.outlineColor = Color3.Black()
        this.artistNameText.outlineWidth = 0.1
        this.artistNameText.hTextAlign = "left"
        this.artistName.addComponent(this.artistNameText)
        this.artistName.setParent(this.parent)
        this.artistName.addComponent(new Transform({
            position: new Vector3(-1.075+0.07, -0.72, -0.002),
            scale: new Vector3(0.05, 0.05, 0.05),
            rotation: Quaternion.Euler(0, 0, 0)
        }))


        this.artistLogoEntity.addComponent(new PlaneShape())
        this.artistLogoEntity.setParent(this.parent)
        this.artistLogoEntity.addComponent(new Transform({
            position: new Vector3(-1.163+0.07, -0.72, -0.002),
            rotation: Quaternion.Euler(180, 180, 0),
            scale: new Vector3(0.09,0.09, 0.01),
        }))

        this.artistLogoTexture = Helper.getIPFSImageTexture(
            (_productData.metadata.productV1Seller.images || []).find(
                (img: { tag: string; }) => img.tag === "profile"
            )?.url
        )

        this.artistLogoMat.albedoTexture = this.artistLogoTexture
        this.artistLogoMat.emissiveIntensity = 1
        this.artistLogoMat.emissiveColor = Color3.White()
        this.artistLogoMat.emissiveTexture = this.artistLogoTexture
        this.artistLogoEntity.addComponent(this.artistLogoMat)

        // Add spring
        this.parent.addComponent(new ScaleSpringComponent(120, 10))

        this.hideWithoutSpring()

    }

    private showNextImage() {
        this.productImageIndex++

        if (this.productImageIndex >= this.productTextures.length) {
            this.productImageIndex = this.productTextures.length - 1
        }

        this.productImageMat.albedoTexture = this.productTextures[this.productImageIndex]
        this.productImageMat.emissiveTexture = this.productTextures[this.productImageIndex]
        this.productImage.getComponent(Transform).scale.y = this.productImage.getComponent(Transform).scale.x * this.productImageSizeRatios[this.productImageIndex]
        this.setImageArrowVisibility()

    }

    private showPreviousImage() {
        this.productImageIndex--

        if (this.productImageIndex < 0) {
            this.productImageIndex = 0
        }

        this.productImageMat.albedoTexture = this.productTextures[this.productImageIndex]
        this.productImageMat.emissiveTexture = this.productTextures[this.productImageIndex]
        this.productImage.getComponent(Transform).scale.y = this.productImage.getComponent(Transform).scale.x * this.productImageSizeRatios[this.productImageIndex]
        this.setImageArrowVisibility()
    }

    private ZoomIn() {
        this.productImage.getComponent(Transform).scale = this.productImage.getComponent(Transform).scale.multiply(new Vector3(2, 2, 2))
        this.productImage.getComponent(Transform).position = new Vector3(0, 0, -0.04)
        this.productZoomMat.albedoTexture = this.productZoomOutTexture
        this.productZoomMat.emissiveTexture = this.productZoomOutTexture

        this.productZoomEntity.addComponentOrReplace(this.productZoomOutPointer)

    }

    private ZoomOut() {
        this.productImage.getComponent(Transform).scale = this.productImage.getComponent(Transform).scale.multiply(new Vector3(0.5, 0.5, 0.5))
        this.productImage.getComponent(Transform).position = new Vector3(-0.65, 0.05, -0.0015),
            this.productZoomMat.albedoTexture = this.productZoomTexture
        this.productZoomMat.emissiveTexture = this.productZoomTexture

        this.productZoomEntity.addComponentOrReplace(this.productZoomPointer)
    }

    private setImageArrowVisibility() {
        if (this.productImageIndex == 0) {
            Helper.hideAllEntities([
                this.productPrevImageEntity
            ])
        } else {
            Helper.showAllEntities([
                this.productPrevImageEntity
            ])
        }

        if (this.productImageIndex == this.productTextures.length - 1) {
            Helper.hideAllEntities([
                this.productNextImageEntity
            ])
        } else {
            Helper.showAllEntities([
                this.productNextImageEntity
            ])
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
            this.productZoomEntity
        ])

        if (this.tokenGatedOffer != undefined) {
            this.tokenGatedOffer.show()
        }

        if (this.lockComponent != undefined) {
            this.lockComponent.show()
        }

        // Only show terms and conditions box, link and commit if the gating isn't locked
        // And is in stock
        let locked: boolean = false

        if (this.kiosk.lockScreen?.lockComponent != undefined) {
            locked = this.kiosk.lockScreen?.lockComponent.locked
        }



        if (!locked) {
            Helper.showAllEntities([
                this.termsAndConditionsEntity,
                this.commitButtonEntity,
                this.lockErrorName
            ])
        } else {
            Helper.hideAllEntities([
                this.termsAndConditionsEntity,
                this.commitButtonEntity,
                this.lockErrorName
            ])
        }

        this.setImageArrowVisibility()


        if (this.kiosk.variations.length > 0) {
            if (this.variationComponent == undefined) {
                this.variationComponent = new VariationComponent(this.kiosk, new Transform({
                    position: new Vector3(0, 0, 0)
                }), this.parent)
            }
        }

        if (this.variationComponent != undefined) {
            this.variationComponent.show()
        }

        this.parent.getComponent(ScaleSpringComponent).targetScale = new Vector3(1, 1, 1)
    }

    public updateStock(_intialStock: number, _currentStock: number) {
        let productRemainingText: string = ""
        let remainingStockPercentage: number = Math.round(_currentStock / _intialStock) * 100
        let productReaminingTextColor: Color3 = Color3.FromHexString("#FC6838") // Orange
        let itemQuantity: number = _currentStock

        if (remainingStockPercentage >= 50) {
            productRemainingText = _currentStock+"/"+_intialStock + " remaining"
        } else if (itemQuantity > 0) {
            productRemainingText = "Only " + _currentStock + " left!"
        } else {
            productRemainingText = "Sold Out!"
            productReaminingTextColor = Color3.Red()
        }

        if (this.productsRemainingText != undefined) {
            this.productsRemainingText.value = productRemainingText
            this.productsRemainingText.color = productReaminingTextColor
            this.productsRemainingText.outlineColor = productReaminingTextColor
        }

        this.productDescriptionPage.updateStock(_intialStock, _currentStock)

        // See if changes to stock effect the commit lock
        this.setCommitLock(_currentStock)

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
            this.productZoomEntity
        ])
        if (this.tokenGatedOffer != undefined) {
            this.tokenGatedOffer.hide()
        }
        this.productDescriptionPage.hide()
    }

    public setCommitLock(_currentStock:number){
        if (this.kiosk.connecectedToWeb3 && this.enoughFunds) {
            this.commitLocked = false
            this.commitButtonMat.albedoTexture = this.commitButtonTexture
            this.commitButtonMat.emissiveTexture = this.commitButtonTexture
        } else {
            this.commitLocked = true
            this.commitButtonMat.albedoTexture = this.commitButtonTextureLocked
            this.commitButtonMat.emissiveTexture = this.commitButtonTextureLocked
        }

        if (_currentStock < 1 && !this.commitLocked) {
            this.commitLocked = true
        }

        if (_currentStock > 0 && this.commitLocked && this.kiosk.connecectedToWeb3 && this.enoughFunds) {
            this.commitLocked = false
        }


    }

    public hide() {
        new DelayedTask(() => {
            this.hideWithoutSpring()
            if (this.processPage.completePage != undefined) {
                this.processPage.completePage.hide()
            }
        }, 1)

        this.parent.getComponent(ScaleSpringComponent).targetScale = new Vector3(0, 0, 0)
    }
}