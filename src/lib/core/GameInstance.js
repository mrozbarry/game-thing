import { Vector2d } from './Vector2d.js';
import { GameEvent } from './GameEvent.js';

export class GameInstance {
  constructor(root, store = {}) {
    this._root = root;
    this._accumulator = 0;
    this._playing = false;
    this._handle = null;
    this._lastTick = null;
    this._store = {
      gravity: new Vector2d(0, 0),
      timestep: 60,
      gametime: 0,
      ...store,
    };
  }

  get root() {
    return this._root;
  }

  set(key, value) {
    this._store[key] = value;
    return this;
  }

  get(key, fallback = null) {
    return key in this._store
      ? this._store[key]
      : fallback;
  }

  change(key, fn, fallback) {
    return this.set(key, fn(this.get(key) || fallback));
  }

  pause() {
    GameInstance.clearFrame(this._handle);
    this._playing = false;
    this._lastTick = null;
  }

  schedule() {
    this._handle = GameInstance.requestFrame((now) => this.tick(now));
  }

  play() {
    this._playing = true;
    this.schedule();
  }

  tick(currentTime) {
    if (!this._playing) return;

    const timestep = this.get('timestep', 60);

    const delta = this._lastTick ? currentTime - this._lastTick : 0;
    this._lastTick = currentTime;
    this._accumulator += delta;

    this._root.handleEvent(
      new GameEvent('tick', { gameInstance: this })
    );

    while (this._accumulator >= timestep) {
      this._accumulator -= timestep;
      this.change('gametime', (old => old + timestep), 0);
      this._root.handleEvent(
        new GameEvent('timestep', { gameInstance: this })
      );
    }
    this.schedule();
  }
}

GameInstance.requestFrame = window.requestAnimationFrame
  ? (fn) => window.requestAnimationFrame(fn)
  : (fn) => window.setTimeout(() => fn(performance ? performance.now() : Date.now()), 0);

GameInstance.clearFrame = window.requestAnimationFrame
  ? (handle) => window.cancelAnimationFrame(handle)
  : (handle) => window.clearTimeout(handle);
