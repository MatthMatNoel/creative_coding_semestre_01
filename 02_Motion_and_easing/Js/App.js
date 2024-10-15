import Letter from "./Letter.js";

export default class App {
  constructor() {
    this.canvas;
    this.ctx;

    this.createCanvas();

    this.letters = [];
    const spacing = 35;
    const size = 20;
    const rows = Math.ceil(this.height / spacing);
    const cols = Math.floor(this.width / spacing);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * spacing + spacing / 2;
        const y = row * spacing + spacing / 2;
        this.letters.push(new Letter(x, y, size, this.width, this.height));
      }
    }
    this.mouseDown = false;

    this.initInteraction();
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

  initInteraction() {
    this.canvas.addEventListener("mousedown", (e) => {
      this.mouseDown = true;
    });

    this.canvas.addEventListener("mouseup", (e) => {
      this.mouseDown = false;
    });

    this.canvas.addEventListener("mousemove", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      this.letters.forEach((letter) => {
        letter.reset(mouseX, mouseY, this.mouseDown);
      });
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = "rgba(255, 255, 255, 1)";
    this.letters.forEach((letter) => {
      letter.update();
      letter.draw(this.ctx);
    });

    requestAnimationFrame(this.draw.bind(this));
  }
}
