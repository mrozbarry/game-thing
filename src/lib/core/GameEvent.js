export class GameEvent {
  constructor(name, data) {
    this._name = name;
    this._data = data;

    this._isPropagating = true;
  }

  get name() {
    return this._name;
  }

  get data() {
    return this._data;
  }

  get isPropagating() {
    return this._isPropagating;
  }

  stopPropagating() {
    this._isPropagating = false;
  }
}

GameEvent.tick = (deltaTime, gameInstance) => new GameEvent(
  'tick',
  { deltaTime, gameInstance },
);
