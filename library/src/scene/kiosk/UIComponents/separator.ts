export class Separator extends Entity {

    static texture:Texture|undefined
    static material:Material|undefined

    constructor(_parent:Entity, _transform:Transform){
        super()

        if(Separator.texture==undefined){
            Separator.texture = new Texture("images/UI/separator.png")
            Separator.material = new Material()
            Separator.material.albedoTexture = Separator.texture
            Separator.material.emissiveIntensity = 1
            Separator.material.emissiveColor = Color3.White()
            Separator.material.emissiveTexture = Separator.texture
            Separator.material.transparencyMode = 1
        }

        this.setParent(_parent)
        this.addComponent(_transform)
        this.addComponent(new PlaneShape())
        if(Separator.material!=undefined){
            this.addComponent(Separator.material)
        }
    }

}