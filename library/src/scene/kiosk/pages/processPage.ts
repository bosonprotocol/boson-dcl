import { ScaleSpringComponent } from "../animation/ScaleSpringComponent"
import { Helper } from "../helper"
import { Kiosk } from "../kiosk"
import { DelayedTask } from "../tasks/DelayedTask"
import { Separator } from "../UIComponents/separator"
import { CompletePage } from "./completePage"
import { ADDRESS_ZERO, checkOfferCommittable, commitToOffer, checkUserCanCommitToOffer } from "../../../core-sdk"
import { CoreSDK } from "../../.."
import {TransactionReceipt} from "@bosonprotocol/common"

export class ProcessPage {

    private _coreSdk: CoreSDK
    private _userAccount: string

    kiosk: Kiosk

    productData: any = undefined
    parent: Entity = new Entity()

    whiteBackgroundBox: Entity = new Entity()
    whiteBackgroundMat: Material = new Material()

    wavesEntity: Entity = new Entity()
    wavesMat: Material = new Material()
    wavesTexture: Texture | undefined

    processingTitle: Entity = new Entity()
    processingTitleText: TextShape | undefined

    cancelButtonEntity: Entity = new Entity()
    cancelButtonMat: Material = new Material()
    cancelButtonTexture: Texture | undefined

    separator: Entity

    hideTask: DelayedTask

    completePage: CompletePage

    constructor(coreSDK: CoreSDK, userAccount: string, _kiosk: Kiosk, _parent: Entity, _productData: any) {
        this._coreSdk = coreSDK
        this._userAccount = userAccount

        this.kiosk = _kiosk
        this.productData = _productData

        // Parent
        this.parent = new Entity()
        this.parent.setParent(_parent)
        this.parent.addComponent(new Transform({
            position: new Vector3(0, 0, 0),
            scale: new Vector3(0, 0, 0)
        }))

        this.completePage = new CompletePage(_kiosk, _parent, _productData)

        // White background Box
        this.whiteBackgroundBox.addComponent(new PlaneShape())
        this.whiteBackgroundBox.setParent(this.parent)
        this.whiteBackgroundBox.addComponent(new Transform({
            position: new Vector3(0, -0.1, -0.006),
            rotation: Quaternion.Euler(180, 180, 0),
            scale: new Vector3(2.6, 1.9, 0.01),
        }))
        this.whiteBackgroundMat = new Material()
        this.whiteBackgroundMat.emissiveIntensity = 1
        this.whiteBackgroundMat.emissiveColor = Color3.White()
        this.whiteBackgroundBox.addComponent(this.whiteBackgroundMat)

        // Waves
        this.wavesEntity = new Entity()
        this.wavesEntity.addComponent(new PlaneShape())
        this.wavesEntity.setParent(this.parent)
        this.wavesEntity.addComponent(new Transform({
            position: new Vector3(0, -0.2, -0.0065),
            rotation: Quaternion.Euler(180, 180, 0),
            scale: new Vector3(0.942 * 2.5, 0.301 * 2.5, 0.01),
        }))

        this.wavesMat = new Material()
        this.wavesTexture = new Texture("images/UI/waves.png", { hasAlpha: true })

        this.wavesMat.albedoTexture = this.wavesTexture
        this.wavesMat.emissiveIntensity = 0.2
        this.wavesMat.emissiveColor = Color3.White()
        this.wavesMat.emissiveTexture = this.wavesTexture
        this.wavesMat.transparencyMode = 2
        this.wavesEntity.addComponent(this.wavesMat)

        // Process title
        this.processingTitleText = new TextShape("Your transaction is being processed...")
        this.processingTitleText.color = Color3.Black()
        this.processingTitleText.fontSize = 8
        this.processingTitleText.outlineColor = Color3.Black()
        this.processingTitleText.outlineWidth = 0.15
        this.processingTitle.addComponent(this.processingTitleText)
        this.processingTitle.setParent(this.parent)
        this.processingTitle.addComponent(new Transform({
            position: new Vector3(0, 0.5, -0.007),
            scale: new Vector3(0.1, 0.1, 0.1),
            rotation: Quaternion.Euler(0, 0, 0)
        }))

        // Cancel button
        this.cancelButtonEntity = new Entity()
        this.cancelButtonEntity.addComponent(new PlaneShape())
        this.cancelButtonEntity.setParent(this.parent)
        this.cancelButtonEntity.addComponent(new Transform({
            position: new Vector3(0, -0.87, -0.007),
            rotation: Quaternion.Euler(180, 180, 0),
            scale: new Vector3(0.445 * 1, 0.190 * 1, 0.01),
        }))

        this.cancelButtonMat = new Material()
        this.cancelButtonTexture = new Texture("images/UI/Cancel.png", { hasAlpha: true })

        this.cancelButtonMat.albedoTexture = this.cancelButtonTexture
        this.cancelButtonMat.emissiveIntensity = 1
        this.cancelButtonMat.emissiveColor = Color3.White()
        this.cancelButtonMat.emissiveTexture = this.cancelButtonTexture
        this.cancelButtonMat.transparencyMode = 2
        this.cancelButtonEntity.addComponent(this.cancelButtonMat)

        this.cancelButtonEntity.addComponent(new OnPointerDown(() => {

            // Get exchange id
            const offer = this.getOfferById(_productData.id).then(
                (data: any) => {
                    //Cancel the transaction call
                    this.cancelCommit(data.offer.exchanges[0].id).then((data) => {

                        // We need to find out the state of the cancelation
                        log(data)

                        // Close the page
                        this.hide()
                    })
                }
            )
        }, {
            hoverText: "Cancel Transaction"
        }))

        this.separator = new Separator(this.parent,
            new Transform({
                position: new Vector3(0, -0.7, -0.007),
                rotation: Quaternion.Euler(180, 180, 0),
                scale: new Vector3(2.6, 0.007, 0.01)
            })
        )

        // Add spring
        this.parent.addComponent(new ScaleSpringComponent(120, 10))

        this.hideTask = new DelayedTask(() => {
            Helper.hideAllEntities([
                this.whiteBackgroundBox,
                this.wavesEntity,
                this.processingTitle,
                this.cancelButtonEntity,
                this.separator
            ])
        }, 1)
    }

    show() {
        new DelayedTask(() => {
            // Commit against the offerID
            this.commit(this.productData).then(
                (data: any) => {
                    // succeeded
                    log(data)
                    // but do we have an error?
                    if(data!=undefined){
                        if(data.error !=undefined){
                            this.completePage.show(false, data.errorMessage)
                            this.hideTask.restart(1)
                        } else {
                            this.completePage.show(true, data)
                            this.hideTask.restart(1)
                        }
                    } else {
                        // The data here should be a Transaction Receipt
                        this.completePage.show(true, data)
                        this.hideTask.restart(1)
                    }
                },
                (data: any) => {
                    // rejected
                    log(data)
                    this.completePage.show(false, data)
                    this.hideTask.restart(1)
                }
            )
        }, 1)

        this.hideTask.cancel()

        Helper.showAllEntities([
            this.whiteBackgroundBox,
            this.wavesEntity,
            this.processingTitle,
            // this.cancelButtonEntity,
            this.separator
        ])

        this.parent.getComponent(ScaleSpringComponent).targetScale = new Vector3(1, 1, 1)
    }

    hide() {
        if (this.hideTask != undefined) {
            this.hideTask.restart(1)
        }
        this.parent.getComponent(ScaleSpringComponent).targetScale = new Vector3(0, 0, 0)
    }

    private async cancelCommit(exchangeId: number): Promise<object> {

        const nonce: number = Date.now()
        const cancelResult: any = await this._coreSdk.signMetaTxCancelVoucher({
            nonce,
            exchangeId
        })

        const responseTx: any = await this._coreSdk.relayMetaTransaction({
            functionName: cancelResult.functionName,
            functionSignature: cancelResult.functionSignature,
            sigR: cancelResult.r,
            sigS: cancelResult.s,
            sigV: cancelResult.v,
            nonce
        })

        return responseTx
    }

    private async getOfferById(id: number): Promise<object> {
        const rtn = await this._coreSdk.getOfferById(id)
        return rtn
    }

    private async commit(offer: any) : Promise<any> {
        try {
            const { isCommittable, voided, notYetValid, expired, soldOut, missingSellerDeposit } = await checkOfferCommittable(this._coreSdk, offer)
            if (!isCommittable) {
                let errorMessage:string = ""
                log(`Offer ${offer.id} can not be committed`)
                if (voided) {
                    errorMessage = `Offer has been voided`
                    log(`Offer ${offer.id} has been voided`)
                    return {error:true,errorMessage:errorMessage}
                }
                if (notYetValid) {
                    errorMessage = `Offer is not valid yet`
                    log(`Offer ${offer.id} is not valid yet`)
                    return {error:true,errorMessage:errorMessage}
                }
                if (expired) {
                    errorMessage = `Offer has expired`
                    log(`Offer ${offer.id} has expired`)
                    return {error:true,errorMessage:errorMessage}
                }
                if (soldOut) {
                    errorMessage = `Offer is sold out`
                    log(`Offer ${offer.id} is sold out`)
                    return {error:true,errorMessage:errorMessage}
                }
                if (missingSellerDeposit) {
                    errorMessage = `Seller deposit can not be secured now`
                    log(`Seller deposit can not be secured now (seller id: ${offer.seller.id})`)
                    return {error:true,errorMessage:errorMessage}
                }
            }
            const { canCommit, approveNeeded } = await checkUserCanCommitToOffer(this._coreSdk, offer, this._userAccount)
            log('canCommit', canCommit)
            log('approveNeeded', !!approveNeeded)
            if(!canCommit){
                return {error:true,errorMessage:"Cannot commit"}
            }
            return await commitToOffer(this._coreSdk, offer, this._userAccount)
        } catch (e:any) {
            log(`ERROR when committing to offer ${offer.id}`, e)
            if(e.details!=undefined){
                return {error:true,errorMessage:e.details}
            } else {
                return {error:true,errorMessage:"An error has occurred"}
            }
        }

    }

}