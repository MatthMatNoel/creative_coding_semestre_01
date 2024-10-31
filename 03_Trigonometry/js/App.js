import Circle from "./Circle.js";
import DrawingTool from "./DrawingTool.js";
import Letter from "./Letter.js";

export default class App {
  constructor() {
    this.canvas;
    this.ctx;

    // premier étape : créer le canvas
    this.createCanvas();

    //créer une lettre
    this.letter = new Letter(this.width / 2, this.height / 2, 250);

    //créer un cercle
    this.circle = new Circle(this.width / 2, this.height / 2, 5);
    this.circle.color = "white";

    // créer un outil de dessin
    this.drawingTool = new DrawingTool(this.ctx);

    this.canvas.addEventListener("click", this.handleClick.bind(this));

    // deuxième étape : dessiner le canvas
    this.draw();
  }
  createCanvas(width = window.innerWidth, height = window.innerHeight) {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    document.body.appendChild(this.canvas);
  }

  handleClick() {
    // Reset the circle's position and motion radius
    this.circle.x = this.width / 2;
    this.circle.y = this.height / 2;
    this.circle.motion_radius = 0;
    this.circle.angle = 0;

    // Change the letter
    this.letter = new Letter(this.width / 2, this.height / 2, 250);

    // Clear the drawing tool points
    this.drawingTool.allPoints = [];
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.circle.move();

    this.changeWidth();

    this.letter.draw(this.ctx);

    this.drawingTool.addPoint(this.circle.x, this.circle.y);
    this.drawingTool.draw();
    this.circle.draw(this.ctx);

    // transformer le canvas en flip book
    requestAnimationFrame(this.draw.bind(this));
  }

  changeWidth() {
    const targetLineWidth = this.letter.isCrossing(this.circle, this.ctx)
      ? 15
      : 1;

    const step = 4;

    if (this.drawingTool.currentLineWidth < targetLineWidth) {
      this.drawingTool.currentLineWidth = Math.min(
        this.drawingTool.currentLineWidth + step,
        targetLineWidth
      );
    } else if (this.drawingTool.currentLineWidth > targetLineWidth) {
      this.drawingTool.currentLineWidth = Math.max(
        this.drawingTool.currentLineWidth - step,
        targetLineWidth
      );
    }
  }
}
