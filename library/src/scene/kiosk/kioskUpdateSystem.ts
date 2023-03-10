import { Helper } from "./helper";
import { Kiosk } from "./kiosk";

export class KioskUpdateSystem implements ISystem {

    // Text update speed
    priceTextUpdateInterval: number = 2 // 2 seconds
    currentTextUpdateInterval: number = this.priceTextUpdateInterval

    // Price refresh speed
    priceRefreshInterval: number = 60 // 1 minute
    currentRefreshInterval: number = this.priceTextUpdateInterval

    kiosks: Kiosk[] = []
    static instance: KioskUpdateSystem

    constructor() {
        if(KioskUpdateSystem.instance) {
            return
        }
        engine.addSystem(this)

        Helper.refreshPrices()
    }

    addKiosks(_kiosks: Kiosk[]) {
        this.kiosks = _kiosks
    }

    addKiosk(_kiosk: Kiosk) {
        this.kiosks.push(_kiosk)
    }

    update(_dt: number): void {
        this.kiosks.forEach(kiosk => {
            kiosk.update(_dt)
        });

        // Check if we need to sent update prices to the kiosk
        this.currentRefreshInterval += _dt
        if (this.currentRefreshInterval >= this.priceRefreshInterval) {
            this.currentRefreshInterval = 0
            log("Price update")
            Helper.refreshPrices()
        }

        this.currentTextUpdateInterval += _dt
        if (this.currentTextUpdateInterval >= this.priceTextUpdateInterval) {
            this.currentTextUpdateInterval = 0
            log("Text update")
            this.kiosks.forEach(kiosk => {
                if (kiosk.productData != undefined) {
                    kiosk.updateProductPrice()
                }
            });
        }
    }
}