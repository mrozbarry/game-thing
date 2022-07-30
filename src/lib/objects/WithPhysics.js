import { GameEvent } from '../core/GameEvent.js';
import { GameObject } from '../core/GameObject.js';
import { Vector2d } from '../core/Vector2d.js';

export class WithPhysics extends GameObject {
  constructor({ position = Vector2d.zero, velocity = Vector2d.zero, mass = Infinity, bounce = 1.0, parent = null, id = 'physics' }) {
    super({ id, parent });
    this._pp = Vector2d.clone(position);
    this._p = Vector2d.clone(position);
    this._v = Vector2d.clone(velocity);
    this._m = Math.abs(Number(mass));
    this._b = Math.abs(Number(bounce));
    this._f = Vector2d.zero;
  }

  get position() {
    return this._p;
  }

  onTimestep(event) {
    const { deltaTime, gameInstance } = event.data;
    const force = this._f.add(gameInstance.get('gravity', Vector2d.zero));

    if (!Number.isFinite(this._m)) {
      return;
    }

    const acceleration = force.multiply(1 / this._m);
    let velocity = this._v.add(acceleration.multiply(deltaTime));
    const position = this._p.add(this._v.multiply(deltaTime));

    if (position.y >= 480) {
      position.y = 480;
      velocity = new Vector2d(this._v.x, -this._b * this._v.y);
    }

    this.parent.handleEvent(new GameEvent('moveTo', { position }));
    this.parent.handleEvent(new GameEvent('velocity', { velocity }));
  }

  onTick() {
    this.parent.handleEvent(new GameEvent('force', { force: Vector2d.zero }));
  }

  onForce(event) {
    this._f = Vector2d.clone(event.data.force);
  }

  onMoveTo(event) {
    this._pp = Vector2d.clone(this.position);
    this._p = Vector2d.clone(event.data.position);
  }

  onVelocity(event) {
    this._v = Vector2d.clone(event.data.velocity);
  }
}
