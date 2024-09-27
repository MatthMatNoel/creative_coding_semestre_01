export default class App {
  constructor() {
    this.canvas; // canvas element
    this.ctx; // canvas context
  }

  // Create canvas function
  createCanvas(width, height) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    document.body.appendChild(this.canvas);
  }

  // Circle function
  circle(x, y, radius) {
    this.ctx = this.canvas.getContext("2d");
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.stroke();
  }
}
