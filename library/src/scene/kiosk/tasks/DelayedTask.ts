/* imports */

import { DelayedTaskSystem } from "./DelayedTaskSystem"

/* class definition */

export class DelayedTask {
    
    /* fields */

    // runtime
    __delay = 0
    __isRegistered: boolean = false

    // configuration
    callback: Function
    delay = 0
    isRepeating = false

    /* methods */

    cancel(): void {
        DelayedTaskSystem.deregisterTask(this)
        this.delay = 0
        this.isRepeating = false
    }

    isBusy(): boolean {
        return this.__isRegistered && (this.isRepeating || this.__delay > 0)
    }

    /* constructor */
    
    constructor(_callback: Function, _delay: number, _isRepeating: boolean = false) {
        
        // store parameters
        this.callback = _callback
        this.delay = _delay
        this.isRepeating = _isRepeating
        
        // initialise the delay
        this.__delay = this.delay

        // register with the system
        DelayedTaskSystem.registerTask(this)
    }

    /* methods */

    restart(_delay: number): void {
        this.__delay = this.delay = _delay
        if (!this.__isRegistered) {
            DelayedTaskSystem.registerTask(this)
        }
    }
}