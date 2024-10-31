export default class DrawingTool {
  constructor(ctx) {
    this.ctx = ctx;
    this.allPoints = [];
    this.currentLineWidth = 1;
  }

  addPoint(x, y) {
    this.allPoints.push({ x, y, lineWidth: this.currentLineWidth });
  }

  draw() {
    this.ctx.strokeStyle = "white";

    for (let i = 1; i < this.allPoints.length; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.allPoints[i - 1].x, this.allPoints[i - 1].y);
      this.ctx.lineTo(this.allPoints[i].x, this.allPoints[i].y);

      // Use the stored line width for each point
      this.ctx.lineWidth = this.allPoints[i].lineWidth;

      this.ctx.stroke();
    }
  }
}
