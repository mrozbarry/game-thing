export class Vector2d {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(other) {
    return new Vector2d(this.x + other.x, this.y + other.y);
  }

  multiply(factor) {
    return new Vector2d(this.x * factor, this.y * factor);
  }

  json() {
    return {
      x: this.x,
      y: this.y,
    };
  }
}
Vector2d.clone = (other) => new Vector2d(other.x || 0, other.y || 0);
Vector2d.zero = (new Vector2d(0, 0))
Vector2d.one = (new Vector2d(1, 1))
