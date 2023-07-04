import { BosonProduct } from "node_modules/@bosonprotocol/boson-dcl/dcl-edit/bosonProduct"
export type DceScene = {
    /**
     * The root entity of the scene. All entities in this scene are children of either this scene root entity, or of another entity in the scene
     */
    sceneRoot: DceEntity

    /**
     * Shows the scene with all its entities. Shortcut for `sceneRoot.show()`
     */
    show: () => void;

    /**
     * Hides the scene with all its entities. Shortcut for `sceneRoot.hide()`
     */
    hide: () => void
}

export type DceEntity = {
    /**
     * The Decentraland entity
     */
    entity: Entity

    /**
     * The Transform component of the entity. Although, it is not required by Decentraland, every DceEntity will have a Transform added
     */
    transform: Transform

    /**
     * Show this entity and all its children. This calls `engine.addEntity(entity)` internally.
     */
    show: () => void

    /**
     * Hide this entity and all its children. This calls `engine.removeEntity(entity)` internally.
     */
    hide: () => void
}

export type WithGLTFShape = {
    gLTFShape: GLTFShape
}

export type WithBosonProduct = {
    bosonProduct: BosonProduct
}

export type NewScene = DceScene & {
    exposed: {
    }
}
export type NewScene2 = DceScene & {
    exposed: {
    }
}
export type NewScene3 = DceScene & {
    exposed: {
    }
}

export class SceneFactory {
    /**
     * Creates a new instance of the scene NewScene
     * @param rootEntity specify a root entity for the newly created scene. If null, a new Entity will be generated as the root
     */
    static createNewScene(rootEntity: Entity | null = null): NewScene {
        if (rootEntity == null) {
            rootEntity = new Entity()
            const rootEntityTrans = new Transform()
            rootEntity.addComponent(rootEntityTrans)
        } else {
            if (!rootEntity.hasComponent(Transform)) {
                rootEntity.addComponent(new Transform)
            }
        }


        engine.addEntity(rootEntity)

        return {
            sceneRoot: {
                entity: rootEntity,
                transform: rootEntity.getComponent(Transform),
                show() { engine.addEntity(this.entity) },
                hide() { engine.removeEntity(this.entity) }
            },
            exposed: {
            },

            show() { this.sceneRoot.show() },
            hide() { this.sceneRoot.hide() }
        }
    }
    /**
     * Creates a new instance of the scene NewScene2
     * @param rootEntity specify a root entity for the newly created scene. If null, a new Entity will be generated as the root
     */
    static createNewScene2(rootEntity: Entity | null = null): NewScene2 {
        if (rootEntity == null) {
            rootEntity = new Entity()
            const rootEntityTrans = new Transform()
            rootEntity.addComponent(rootEntityTrans)
        } else {
            if (!rootEntity.hasComponent(Transform)) {
                rootEntity.addComponent(new Transform)
            }
        }


        engine.addEntity(rootEntity)

        return {
            sceneRoot: {
                entity: rootEntity,
                transform: rootEntity.getComponent(Transform),
                show() { engine.addEntity(this.entity) },
                hide() { engine.removeEntity(this.entity) }
            },
            exposed: {
            },

            show() { this.sceneRoot.show() },
            hide() { this.sceneRoot.hide() }
        }
    }
    /**
     * Creates a new instance of the scene NewScene3
     * @param rootEntity specify a root entity for the newly created scene. If null, a new Entity will be generated as the root
     */
    static createNewScene3(rootEntity: Entity | null = null): NewScene3 {
        if (rootEntity == null) {
            rootEntity = new Entity()
            const rootEntityTrans = new Transform()
            rootEntity.addComponent(rootEntityTrans)
        } else {
            if (!rootEntity.hasComponent(Transform)) {
                rootEntity.addComponent(new Transform)
            }
        }

        const ent4_FridgeCounter1 = new Entity("Fridge Counter")
        const ent4_FridgeCounter1Transform = new Transform()
        ent4_FridgeCounter1Transform.position = new Vector3(10.38984, 0, 7.393251)
        ent4_FridgeCounter1Transform.rotation = new Quaternion(0, 0, 0, 1)
        ent4_FridgeCounter1Transform.scale = new Vector3(1, 1, 1)
        if("init" in ent4_FridgeCounter1Transform && typeof ent4_FridgeCounter1Transform.init === "function")
        {
            ent4_FridgeCounter1Transform.init(ent4_FridgeCounter1)
        }
        ent4_FridgeCounter1.addComponent(ent4_FridgeCounter1Transform)
        const ent4_FridgeCounter1GLTFShape = new GLTFShape("dcl-edit/build/builder_assets/Fridge_Counter.glb")
        ent4_FridgeCounter1GLTFShape.visible = true
        ent4_FridgeCounter1GLTFShape.withCollisions = true
        ent4_FridgeCounter1GLTFShape.isPointerBlocker = true
        if("init" in ent4_FridgeCounter1GLTFShape && typeof ent4_FridgeCounter1GLTFShape.init === "function")
        {
            ent4_FridgeCounter1GLTFShape.init(ent4_FridgeCounter1)
        }
        ent4_FridgeCounter1.addComponent(ent4_FridgeCounter1GLTFShape)

        const ent4_Microwave1 = new Entity("Microwave")
        const ent4_Microwave1Transform = new Transform()
        ent4_Microwave1Transform.position = new Vector3(8.436262, 1.009697, 6.974515)
        ent4_Microwave1Transform.rotation = new Quaternion(0, 0, 0, 1)
        ent4_Microwave1Transform.scale = new Vector3(1, 1, 1)
        if("init" in ent4_Microwave1Transform && typeof ent4_Microwave1Transform.init === "function")
        {
            ent4_Microwave1Transform.init(ent4_Microwave1)
        }
        ent4_Microwave1.addComponent(ent4_Microwave1Transform)
        const ent4_Microwave1GLTFShape = new GLTFShape("dcl-edit/build/builder_assets/models/Microwave_Closed.glb")
        ent4_Microwave1GLTFShape.visible = true
        ent4_Microwave1GLTFShape.withCollisions = true
        ent4_Microwave1GLTFShape.isPointerBlocker = true
        if("init" in ent4_Microwave1GLTFShape && typeof ent4_Microwave1GLTFShape.init === "function")
        {
            ent4_Microwave1GLTFShape.init(ent4_Microwave1)
        }
        ent4_Microwave1.addComponent(ent4_Microwave1GLTFShape)
        const ent4_Microwave1BosonProduct = new BosonProduct()
        ent4_Microwave1BosonProduct.productUUID = "f04f0f6-107a-b1ef-a4af-dc4bd0a8eb1f"
        ent4_Microwave1BosonProduct.environment = "production"
        if("init" in ent4_Microwave1BosonProduct && typeof ent4_Microwave1BosonProduct.init === "function")
        {
            ent4_Microwave1BosonProduct.init(ent4_Microwave1)
        }
        ent4_Microwave1.addComponent(ent4_Microwave1BosonProduct)

        ent4_FridgeCounter1.setParent(rootEntity)
        ent4_Microwave1.setParent(rootEntity)

        engine.addEntity(rootEntity)

        return {
            sceneRoot: {
                entity: rootEntity,
                transform: rootEntity.getComponent(Transform),
                show() { engine.addEntity(this.entity) },
                hide() { engine.removeEntity(this.entity) }
            },
            exposed: {
            },

            show() { this.sceneRoot.show() },
            hide() { this.sceneRoot.hide() }
        }
    }
}
