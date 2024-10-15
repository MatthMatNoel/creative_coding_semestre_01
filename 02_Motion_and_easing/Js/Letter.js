import Easing from "./Easing";

export default class Letter {
  constructor(x, y, size, canvasWidth, canvasHeight) {
    this.x = x;
    this.y = y;

    this.targetx = x;
    this.targety = y;
    this.originx = x;
    this.originy = y;

    this.size = size;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    this.mouseRadius = 100;

    this.characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    this.character =
      this.characters[Math.floor(Math.random() * this.characters.length)];

    this.speed = 0.02;
    this.timing = 0;

    this.force = -1;
  }

  update() {
    this.timing += this.speed;
    const easing = Easing.expoOut(this.timing);

    this.x = this.originx + (this.targetx - this.originx) * easing * this.force;
    this.y = this.originy + (this.targety - this.originy) * easing * this.force;

    const halfSize = this.size / 2;

    if (this.x - halfSize < 0) {
      this.x = halfSize;
    }
    if (this.x + halfSize > this.canvasWidth) {
      this.x = this.canvasWidth - halfSize;
    }
    if (this.y - halfSize < 0) {
      this.y = halfSize;
    }
    if (this.y + halfSize > this.canvasHeight) {
      this.y = this.canvasHeight - halfSize;
    }
  }

  draw(ctx) {
    ctx.font = `${this.size}px Futura`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.character, this.x, this.y);
  }

  reset(x, y, invertForce) {
    const distance = Math.sqrt((this.x - x) ** 2 + (this.y - y) ** 2);
    if (distance <= this.mouseRadius) {
      this.targetx = x;
      this.targety = y;
      this.originx = this.x;
      this.originy = this.y;
      this.timing = 0;
      if (invertForce) {
        this.force = 0.75;
      } else {
        this.force = -1;
      }
    }
  }
}
