export default class Circle {
  constructor(context) {
    this.ctx = context;
  }

  // Circle function
  draw(x, y, radius) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }
}
