import { GameObject } from '../core/GameObject.js';
import { GameEvent } from '../core/GameEvent.js';
import { Vector2d } from '../core/Vector2d.js';

export class Collidable extends GameObject {
  constructor({ parent, position = Vector2d.zero, size = Vector2d.one, anchor = CollisionBox.ANCHOR_BOTTOM_CENTER }) {
    super({ parent });

    this._position = position;
    this._size = size;
    this._anchor = anchor;

    this.root.handlEvent(new GameEvent(
      'collisionHandlerRegister',
      { gameObject: this },
    ));
  }

  onDispose() {
    this.root.handlEvent(new GameEvent(
      'collisionHandlerDeregister',
      { gameObject: this },
    ));
  }

  get position() { return Vector2d.clone(this._position); }
  get size() { return Vector2d.clone(this._size); }
  get width() { return this._size.x; }
  get height() { return this._size.y; }
  get anchor() { return this._anchor; }

  get topLeft() {
    switch (this.anchor) {
      case CollisionBox.ANCHOR_BOTTOM_LEFT:
        return this.position.add(new Vector2d(0, -this.height));

      case CollisionBox.ANCHOR_BOTTOM_CENTER:
        return this.position.add(new Vector2d(this.width / -2, -this.height));

      default:
        return this.position;
    }
  }

  get bottomRight() { return this.topLeft.add(this.size); }

  onMoveTo(position) {
    this._position = Vector2d.clone(position);
  }

  onResize(size) {
    this._size = Vector2d.clone(size);
  }
}

CollisionBox.ANCHOR_TOP_LEFT = 0;
CollisionBox.ANCHOR_CENTER_CENTER= 1;
CollisionBox.ANCHOR_BOTTOM_LEFT = 2;
CollisionBox.ANCHOR_BOTTOM_CENTER = 3;
