export default class Point {
  constructor(context) {
    this.ctx = context;
  }

  draw(x, y, radius) {
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    // Interpolate color between red and yellow based on radius
    const maxRadius = 80; // Define the maximum radius for interpolation
    const minRadius = 20; // Define the minimum radius for interpolation
    const clampedRadius = Math.max(minRadius, Math.min(maxRadius, radius));
    const ratio = (clampedRadius - minRadius) / (maxRadius - minRadius);

    const red = 255;
    const green = Math.floor(255 * ratio);
    const blue = Math.floor(255 * (1 - ratio));

    this.ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;

    this.ctx.font = `${radius}px monospace`;

    this.ctx.fillText(`${Math.floor(radius)}`, x, y);
  }
}

// ${Math.floor(radius)}
