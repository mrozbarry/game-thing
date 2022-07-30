import { GameEvent } from "./GameEvent";

export class GameObject {
  constructor({
    id = null,
    parent = null,
  }) {
    this._id = id || GameObject.makeId();
    this._children = [];
    this._parent = null;

    if (parent) {
      parent.addChild(this);
    }
  }

  get root() {
    return this._parent
      ? this._parent.root
      : this;
  }

  get id() {
    return this._id;
  }

  handleEvent(event) {
    if (!event.isPropagating) {
      return;
    }

    this.triggerEvent(event);
    this.dispatchEvent(event);
  }

  dispatchEvent(event) {
    this.forEach(c => {
      c.handleEvent(event);
    });
  }

  triggerEvent(event) {
    const fnName = `on${event.name.charAt(0).toUpperCase()}${event.name.slice(1)}`;

    this.execEvent(fnName, event)
      || this.execEvent('onUnhandledEvent', fnName, event);

    return this;
  }

  execEvent(fnName, event) {
    if (typeof this[fnName] !== 'function') {
      return false;
    }

    try {
      this[fnName](event);
    } catch (err) {
      if (!this.execEvent('onException', err, fnName, event)) {
        throw err;
      }
    }

    return true;
  }

  setParent(parent) {
    this._parent = parent || null;

    return this;
  }

  add(child) {
    child.detach();
    child.setParent(this);
    this._children.push(child);
    return this;
  }

  get(childId) {
    return this.find(child => child.id === childId);
  }

  remove(childId) {
    const index = this.findIndex(c => c.id === childId);
    if (index >= 0) {
      const [child] = this._children.splice(index, 1);
      if (child) {
        child.setParent(null);
        child.handleEvent(new GameEvent('dispose', {}));
      }
    }

    return this;
  }

  forEach(fn) {
    return this._children.forEach(fn);
  }

  find(fn) {
    return this._children.find(fn);
  }

  findIndex(fn) {
    return this._children.findIndex(fn);
  }

  detach() {
    if (!this._parent) {
      return this;
    }

    this._parent.remove(this.id);

    return this;
  }
}

GameObject.makeId = () => Math.random().toString(36).slice(2);
