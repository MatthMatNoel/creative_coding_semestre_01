import BaseApp from "./BaseApp";
import WebcamManager from "./WebcamManager";
import GridOverlay from "./GridOverlay";
import SliderControl from "./SliderControl";
import CheckboxControl from "./CheckboxControl";

export default class App extends BaseApp {
  constructor() {
    super();
    this.webcamManager = new WebcamManager();
    this.gridOverlay = new GridOverlay(100, 100);
    this.showGrid = false;

    this.gridOverlay.rows = 100;
    this.gridOverlay.columns = 100;
    this.gridOverlay.borderRadius = 0;
    this.showGrid = true;

    this.glitchToggle = new CheckboxControl({
      label: "Glitch mode",
      checked: true,
      onChange: (value) => {
        this.glitchToggle = value;
        console.log("Glitch mode:", value);
      },
    });

    this.init();
  }

  async init() {
    await this.webcamManager.initialize();
    this.draw();
  }

  draw() {
    // Effacer le canvas et redessiner
    const ctx = this.ctx;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Only draw the grid if showGrid is true
    if (this.showGrid) {
      this.gridOverlay.draw(
        ctx,
        this.webcamManager.getVideo(),
        this.glitchToggle
      );
    } else {
      // Draw just the video without the grid
      const video = this.webcamManager.getVideo();
      ctx.drawImage(video, 0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    requestAnimationFrame(this.draw.bind(this));
  }
}
