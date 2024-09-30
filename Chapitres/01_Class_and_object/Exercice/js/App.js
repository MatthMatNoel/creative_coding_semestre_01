import Point from "./Point.js";
import Canvas from "./Canvas.js";

export default class App {
  constructor() {
    const canvas = new Canvas();
    const ctx = canvas.getContext();

    let step = 20;
    let radius = 40;

    // Determine the bigger dimension
    let maxDimension = Math.max(window.innerWidth, window.innerHeight);
    let space = maxDimension / step;

    let point = new Point(ctx);
    let lastFrameTime = 0;
    const frameDuration = 1000 / 60;

    // Calculate the starting positions to center the grid
    let startX = canvas.getWidth() - maxDimension;
    let startY = canvas.getHeight() - maxDimension;

    let time = 0;

    const animate = (timestamp) => {
      if (timestamp - lastFrameTime < frameDuration) {
        requestAnimationFrame(animate);
        return;
      }
      lastFrameTime = timestamp;

      ctx.clearRect(0, 0, canvas.getWidth(), canvas.getHeight());

      for (let i = 0; i < step + 1; i++) {
        for (let j = 0; j < step + 1; j++) {
          let animatedRadius = Math.max(
            0, // Ensure the radius is not negative
            radius + 20 * (Math.cos(time * i + j) + Math.sin(time * j + i))
          );
          point.draw(startX + i * space, startY + j * space, animatedRadius);
        }
      }

      time += 0.05;
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }
}
