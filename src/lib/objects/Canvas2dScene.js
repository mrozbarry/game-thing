import { GameObject } from '../core/GameObject.js';
import { Vector2d } from '../core/Vector2d.js';
import { GameEvent } from '../core/GameEvent.js';

import { render, c } from 'declarativas';

const declarativasNoop = (_, children) => children;

const restorable = (children) => [
  c('save'),

  ...children,

  c('restore'),
];

export class Canvas2dScene extends GameObject {
  constructor({ canvas, frameComponent = declarativasNoop, parent = null }) {
    super({ parent });

    this._canvas = canvas;
    this._ctx = this._canvas.getContext('2d');

    this._camera = Vector2d.zero;

    this._frameComponent = frameComponent;

    this.reset();
  }

  get ctx() {
    return this._ctx;
  }

  reset() {
    this.layers = {
      game: [],
      ui: [],
    };
  }

  push(layerName, component) {
    this.layers[layerName].push(component);
  }

  onTick(event) {
    const { deltaTime, gameInstance } = event.data;
    this.reset();

    this.dispatchEvent(new GameEvent('render', { deltaTime, scene: this, gameInstance }));

    render(
      this.ctx,
      restorable([
        this._frameComponent(this.ctx, [
          restorable([
            c('translate', this._camera.multiply(-1).json()),
            ...this.layers.game,
          ]),
          restorable(this.layers.ui),
        ]),
      ]),
    );
  }
}
