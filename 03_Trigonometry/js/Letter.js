import opentype from "opentype.js";

export default class Letter {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    this.character = characters[Math.floor(Math.random() * characters.length)];
    this.path = null;
    this.loadFont();
  }

  loadFont() {
    opentype.load("futur.ttf", (err, font) => {
      if (err) {
        console.error("Could not load font: " + err);
      } else {
        const path = font.getPath(
          this.character,
          this.x - this.radius,
          this.y + this.radius,
          this.radius * 3
        );
        this.path = path.toPathData();
      }
    });
  }

  draw(ctx) {
    if (this.path) {
      const path = new Path2D(this.path);
      // ctx.fill(path);
    }
  }

  isCrossing(circle, ctx) {
    if (!this.path) return false;
    const path = new Path2D(this.path);
    return ctx.isPointInPath(path, circle.x, circle.y);
  }
}
