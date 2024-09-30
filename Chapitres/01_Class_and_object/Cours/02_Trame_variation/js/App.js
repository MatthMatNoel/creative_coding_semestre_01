import Circle from "./Circle.js";

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
    this.ctx = this.canvas.getContext("2d");
  }

  // // Circle function
  // circle(x, y, radius) {
  //   this.ctx = this.canvas.getContext("2d");
  //   this.ctx.beginPath();
  //   this.ctx.arc(x, y, radius, 0, Math.PI * 2);
  //   this.ctx.fill();
  // }

  createGrid() {
    let step = 30;
    let radius = 10;
    let spaceX = window.innerWidth / step;
    let spaceY = window.innerHeight / step;

    let monCercle = new Circle(this.ctx);

    for (let i = 0; i < step + 1; i++) {
      for (let j = 0; j < step + 1; j++) {
        monCercle.draw(i * spaceX, j * spaceY, radius);
      }
    }
  }
}
