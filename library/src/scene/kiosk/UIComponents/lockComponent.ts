import { Helper } from "../helper";

export class LockComponent {

    // artist image for lock
    artistEntity: Entity = new Entity()
    artistMat: Material = new Material()
    artistTexture: Texture | undefined

    // Artist background in case it has alpha
    artistFillEntity: Entity = new Entity()
    artistFillMat: Material = new Material()

    // lock
    backgroundEntity: Entity = new Entity()
    foregroundEntity: Entity = new Entity()
    lockMaterial: Material = new Material()
    lockTextureUnlocked: Texture | undefined
    lockTextureLocked: Texture | undefined

    public locked: boolean = true

    constructor(_productData: any, _parent: Entity, _transform: Transform) {

        this.foregroundEntity = new Entity()
        this.foregroundEntity.addComponent(new PlaneShape())
        this.foregroundEntity.setParent(_parent)
        this.foregroundEntity.addComponent(new Transform({
            position: new Vector3(_transform.position.x + 0.07, _transform.position.y, _transform.position.z - 0.02),
            rotation: _transform.rotation,
            scale: new Vector3(_transform.scale.x*1.2, _transform.scale.y*1.2, 0.01)
        }))


        // Artist background
        this.artistFillEntity = new Entity()
        this.artistFillEntity.addComponent(new PlaneShape())
        this.artistFillEntity.setParent(_parent)
        this.artistFillEntity.addComponent(new Transform({
            position: new Vector3(_transform.position.x, _transform.position.y, _transform.position.z - 0.0005),
            scale: _transform.scale
        }))

        this.artistFillMat.emissiveIntensity = 0.25
        this.artistFillMat.emissiveColor = Color3.White()
        this.artistFillMat.alphaTexture = new Texture("images/UI/gateMask.png")
        this.artistFillMat.transparencyMode = 2
        this.artistFillEntity.addComponent(this.artistFillMat)

        // Artist image for lock
        this.artistEntity = new Entity()
        this.artistEntity.addComponent(new PlaneShape())
        this.artistEntity.setParent(_parent)
        this.artistEntity.addComponent(new Transform({
            position: new Vector3(_transform.position.x, _transform.position.y, _transform.position.z - 0.0008),
            scale: _transform.scale
        }))

        this.artistMat = new Material()

        if (_productData.metadata.productV1Seller.images.length > 0) {
            let targetImage = (_productData.metadata.productV1Seller.images || []).find(
                (img: { tag: string; }) => img.tag === "profile"
            )

            this.artistTexture = Helper.getIPFSImageTexture(targetImage?.url)

            this.artistMat.albedoTexture = this.artistTexture
            this.artistMat.emissiveIntensity = 1
            this.artistMat.emissiveColor = Color3.White()
            this.artistMat.emissiveTexture = this.artistTexture
            this.artistMat.alphaTexture = new Texture("images/UI/gateMask.png")
            this.artistMat.transparencyMode = 2
            this.artistEntity.addComponent(this.artistMat)
            this.artistEntity.getComponent(Transform).scale.y = this.artistEntity.getComponent(Transform).scale.x * (targetImage.height / targetImage.width)
        }

        //Lock
        this.backgroundEntity = new Entity()
        this.backgroundEntity.addComponent(new PlaneShape())
        this.backgroundEntity.setParent(_parent)
        this.backgroundEntity.addComponent(new Transform({
            position: new Vector3(_transform.position.x, _transform.position.y, _transform.position.z - 0.00),
            rotation: _transform.rotation,
            scale: new Vector3(_transform.scale.x*1.2, _transform.scale.y*1.2, 0.01)
        }))


        this.lockMaterial = new Material()
        this.lockTextureUnlocked = new Texture("images/UI/GateLockTick.png")
        this.lockTextureLocked = new Texture("images/UI/GateLockCross.png")

        this.lockMaterial.albedoTexture = this.lockTextureLocked
        this.lockMaterial.emissiveIntensity = 0.25
        this.lockMaterial.emissiveColor = Color3.White()
        this.lockMaterial.emissiveTexture = this.lockTextureLocked
        this.lockMaterial.transparencyMode = 2
        this.backgroundEntity.addComponent(this.lockMaterial)
        this.foregroundEntity.addComponent(this.lockMaterial)

        this.setLock()
    }

    show() {
        Helper.showAllEntities([
            this.artistEntity,
            this.backgroundEntity,
            this.foregroundEntity,
            this.artistFillEntity
        ])
    }

    hide() {
        Helper.hideAllEntities([
            this.artistEntity,
            this.backgroundEntity,
            this.foregroundEntity,
            this.artistFillEntity
        ])
    }

    setLock() {
        if (this.locked) {
            this.lockMaterial.albedoTexture = this.lockTextureLocked
            this.lockMaterial.emissiveTexture = this.lockTextureLocked
        } else {
            this.lockMaterial.albedoTexture = this.lockTextureUnlocked
            this.lockMaterial.emissiveTexture = this.lockTextureUnlocked
        }
    }
}