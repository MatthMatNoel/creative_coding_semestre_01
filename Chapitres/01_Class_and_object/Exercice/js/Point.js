export default class Point {
  constructor(context) {
    this.ctx = context;
  }

  draw(x, y, radius) {
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillStyle = "#ffffff";
    this.ctx.font = `${radius}px monospace`;

    this.ctx.fillText(`${Math.floor(radius)}`, x, y);
  }
}

// ${Math.floor(radius)}
