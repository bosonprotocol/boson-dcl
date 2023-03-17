import { ITimerComponent } from "./itimercomponent";

export class TimerSystem implements ISystem {
  private static _instance: TimerSystem | null = null;

  private _components: ComponentConstructor<ITimerComponent>[] = [];

  static createAndAddToEngine(): TimerSystem {
    if (this._instance == null) {
      this._instance = new TimerSystem();
      engine.addSystem(this._instance);
    }
    return this._instance;
  }

  static registerCustomComponent<T extends ITimerComponent>(
    component: ComponentConstructor<T>
  ) {
    this.createAndAddToEngine()._components.push(component);
  }

  public addComponentType(component: ComponentConstructor<ITimerComponent>) {
    for (let i = 0; i < this._components.length; i++) {
      const comp = this._components[i];
      if (component == comp) {
        return;
      }
    }
    this._components.push(component);
  }

  private constructor() {
    TimerSystem._instance = this;
  }

  update(dt: number) {
    this._components.forEach((component) => {
      this.updateComponent(dt, component);
    });
  }

  private updateComponent<T extends ITimerComponent>(
    dt: number,
    component: ComponentConstructor<T>
  ) {
    const record = engine.getEntitiesWithComponent(component);

    for (const key in record) {
      // eslint-disable-next-line no-prototype-builtins
      if (record.hasOwnProperty(key)) {
        const entity = record[key];
        const timerComponent = entity.getComponent(component);

        timerComponent.elapsedTime += dt;
        if (timerComponent.elapsedTime >= timerComponent.targetTime) {
          timerComponent.onTargetTimeReached(entity);
        }
      }
    }
  }
}
