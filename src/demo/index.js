import { GameInstance } from '../lib/core/GameInstance.js';
import { GameObject } from '../lib/core/GameObject.js';
import { Vector2d } from '../lib/core/Vector2d.js';
import { Canvas2dScene } from '../lib/objects/Canvas2dScene.js';
import { WithPhysics } from '../lib/objects/WithPhysics.js';
import { c } from 'declarativas';

const canvas = document.querySelector('canvas');

class PointObject extends GameObject {
  constructor({ x, y, parent }) {
    super({ parent, id: 'PointObject' });

    this.add(new WithPhysics({
      position: new Vector2d(x, y),
      size: Vector2d.one,
      mass: 100,
      bounce: 0.3,
      id: 'physics',
    }));
  }

  onRender(event) {
    const { scene } = event.data;
    const position = this.get('physics').position;

    scene.push('game', [
      c('fillStyle', { value: 'black' }),
      c('fillRect', {
        x: position.x - 1,
        y: position.y - 3,
        width: 3,
        height: 3,
      }),
    ]);
  }
}

(new GameInstance((new Canvas2dScene({
    canvas,
    frameComponent: (ctx, children) => {
      return [
        c('fillStyle', { value: 'rgba(255, 255, 255, 0.2)' }),
        c('fillRect', { x: 0, y: 0, width: ctx.canvas.width, height: ctx.canvas.height }),
        children,
      ];
    },
  }))
  .add(new PointObject({ x: canvas.width / 2, y: 10 })))
)
  .set('gravity', new Vector2d(0, 0.0001))
  .set('timestep', 60)
  .play();

