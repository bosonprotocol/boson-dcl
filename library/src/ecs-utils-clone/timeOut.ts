import { Delay } from "./delay";
import { Interval } from "./interval";

/**
 * Quick function to delay the execution of a lambda after a given amount of time.
 * @public
 *
 * @param ms - Time im milliseconds to delay the function
 * @param callback - Function to execute when the time is up
 */
export function setTimeout(ms: number, callback: () => void): Entity {
  const entity = new Entity();
  entity.addComponent(
    new Delay(ms, () => {
      callback();
      engine.removeEntity(entity);
    })
  );
  engine.addEntity(entity);

  return entity;
}

export function setInterval(ms: number, callback: () => void): Entity {
  const entity = new Entity();
  entity.addComponent(
    new Interval(ms, () => {
      callback();
    })
  );
  engine.addEntity(entity);

  return entity;
}

export function clearInterval(entity: Entity) {
  entity.removeComponent("timerInterval");
}
