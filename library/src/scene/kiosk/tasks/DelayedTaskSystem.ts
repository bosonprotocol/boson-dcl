/* imports */

import { DelayedTask } from "./DelayedTask"

/* system definition */

export class DelayedTaskSystem implements ISystem {

    /* fields */

    // runtime
    __tasks: DelayedTask[]

    // static
    static instance: DelayedTaskSystem

    /* constructor */

    constructor() {
        
        // intialise the task collection
        this.__tasks = []

        // store this as the global instance
        DelayedTaskSystem.instance = this
    }

    /* methods */

    static deregisterTask(_task: DelayedTask) {

        // ensure a system
        if (DelayedTaskSystem.instance === undefined || DelayedTaskSystem.instance === null) {
            return
        }

        // add the task to the collection
        const idx = DelayedTaskSystem.instance.__tasks.indexOf(_task)
        if (idx > -1) {
            DelayedTaskSystem.instance.__tasks.splice(idx, 1)
            _task.__isRegistered = false
        }
    }

    static registerTask(_task: DelayedTask) {

        // ensure a system
        if (DelayedTaskSystem.instance === undefined || DelayedTaskSystem.instance === null) {
            engine.addSystem(new DelayedTaskSystem())
        }

        // add the task to the collection
        if (!_task.__isRegistered) {
            DelayedTaskSystem.instance.__tasks.push(_task)
            _task.__isRegistered = true
        }
    }

    /* implementation of ISystem */

    update(_deltaTime: number) {

        // iterate any registered tasks
        for (let i = 0; i < this.__tasks.length; i++) {

            // countdown the delay
            const task = this.__tasks[i]
            task.__delay -= _deltaTime
            if (task.__delay <= 0) {

                // fire the callback
                if (task.callback && task.callback !== null) {
                    task.callback()
                }

                // check if this is a repeating task
                if (task.isRepeating) {

                    // restart the timer
                    task.__delay = task.delay
                }
                else {

                    // remove the task
                    this.__tasks[i].__isRegistered = false
                    this.__tasks.splice(i, 1)
                    i--
                }
            }
        }
    }
}