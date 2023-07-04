import { AbstractKiosk } from "./abstractKiosk";
import { Helper } from "./helper";
import { Kiosk } from "./kiosk";

export class KioskUpdateSystem implements ISystem {
  // Text update speed
  priceTextUpdateInterval = 2; // 2 seconds
  currentTextUpdateInterval: number = this.priceTextUpdateInterval;

  // Price refresh speed
  priceRefreshInterval = 60; // 1 minute
  currentRefreshInterval: number = this.priceTextUpdateInterval;

  kiosks: (Kiosk | AbstractKiosk)[] = [];
  static instance: KioskUpdateSystem;

  constructor() {
    if (KioskUpdateSystem.instance) {
      return;
    }
    engine.addSystem(this);

    Helper.refreshPrices();
  }

  addKiosk(_kiosk: Kiosk | AbstractKiosk) {
    this.kiosks.push(_kiosk);
  }

  update(_dt: number): void {
    this.kiosks.forEach((kiosk: Kiosk | AbstractKiosk) => {
      kiosk.update(_dt);
    });

    // Check if we need to sent update prices to the kiosk
    this.currentRefreshInterval += _dt;
    if (this.currentRefreshInterval >= this.priceRefreshInterval) {
      this.currentRefreshInterval = 0;
      Helper.refreshPrices();
    }

    this.currentTextUpdateInterval += _dt;
    if (this.currentTextUpdateInterval >= this.priceTextUpdateInterval) {
      this.currentTextUpdateInterval = 0;
      this.kiosks.forEach((kiosk) => {
        if (kiosk.productData != undefined) {
          kiosk.updateProductPrice();
        }
      });
    }
  }
}
