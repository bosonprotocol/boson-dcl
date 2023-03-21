export class Wave extends Entity {
    
    material:Material
    texture:Texture
    scrollX:number = 0
    speed: number = 0
    
    constructor(_texturePath:string,_parent:Entity,_speed:number, _startOffset:number){
        super()
        this.scrollX = _startOffset
        this.texture = new Texture(_texturePath,{hasAlpha: true, wrap:1})
        this.material = new Material()
        this.material.albedoTexture = this.texture
        this.material.emissiveColor = Color3.White()
        this.material.emissiveTexture = this.texture
        this.material.emissiveIntensity = 0.3
        this.material.roughness = 1
        this.material.transparencyMode = 2

        this.setParent(_parent)
        this.addComponent(new PlaneShape())
        this.addComponent(this.material)

        this.speed = _speed
    }

    update(_dt:number){
        this.scrollX+=_dt*this.speed
       if(this.scrollX>1){
           this.scrollX -=1
       }
        this.getComponent(PlaneShape).uvs = this.setUVs(this.scrollX,0)
    }

    setUVs(scrollX : number, scrollY : number) {
        return [
            // North side of unrortated plane
            0 + scrollX, //lower-left corner
            0 + scrollY,
    
            1 + scrollX, //lower-right corner
            0 + scrollY,
    
            1 + scrollX, //upper-right corner
            1 + scrollY,
    
            0 + scrollX, //upper left-corner
            1 + scrollY,
    
            // South side of unrortated plane
            1 + scrollX, // lower-right corner
            0 + scrollY,
    
            0 + scrollX, // lower-left corner
            0+ scrollY,
    
            0 + scrollX, // upper-left corner
            1 + scrollY,
    
            1 + scrollX, // upper-right corner
            1 + scrollY,
        ]
        }
}

export class WaveAnimationSystem implements ISystem{    
    waves:Wave[] = []

    // wave parent
    waveParent:Entity = new Entity()

    constructor(){
        this.waveParent.addComponent(new Transform({
            position: new Vector3(0,-0.2,-0.05),
            rotation: Quaternion.Euler(0,0,0),
            scale: new Vector3(2,1,1)
        }))

        this.waves.push(new Wave("images/kiosk/ui/line1.png", this.waveParent, 0.8,1.5))
        this.waves.push(new Wave("images/kiosk/ui/line2.png", this.waveParent, 0.6,1.1))
        this.waves.push(new Wave("images/kiosk/ui/line3.png", this.waveParent, 0.5,1.3))
        this.waves.push(new Wave("images/kiosk/ui/line4.png", this.waveParent, 0.5,0.9))

    }

    setNewParent(_parent:Entity){
        this.waveParent.setParent(_parent)
        if(!this.waveParent.isAddedToEngine()){
            engine.addEntity(this.waveParent)
        }
    }

    hide(){
        if(this.waveParent.isAddedToEngine()){
            engine.removeEntity(this.waveParent)
        }
    }

    update(dt: number): void {
        this.waves.forEach(wave => {
            wave.update(dt)
        });
    }
}