import { GameEvent } from '../core/GameEvent.js';
import { GameObject } from '../core/GameObject.js';

export class CollisionHandler extends GameObject {
  constructor({ parent }) {
    super({ parent });

    this._objects = [];
  }

  onCollisionHandlerRegister(event) {
    this._objects.push(event.gameObject);
  }

  onCollisionHandlerDeregister(event) {
    const index = this._objects.findIndex(o => o === event.gameObject);
    if (index === -1) {
      return;
    }

    this._objects.splice(index, 1);
  }

  onTimestep(_event) {
  }

  collide(a, b) {
    const collision = { a, b };
    a.handleEvent(new GameEvent('collision', collision));
    b.handleEvent(new GameEvent('collision', collision));
  }
}
