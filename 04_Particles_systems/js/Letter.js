import opentype from "opentype.js";

export default class Letter {
  constructor(fontSize) {
    this.fontSize = fontSize;
    this.character = this.getRandomCharacter();
    this.path = null;
    this.x = window.innerWidth;
    this.y = window.innerHeight;
  }

  getRandomCharacter() {
    const characters = "M";
    return characters[Math.floor(Math.random() * characters.length)];
  }

  async loadFont() {
    return new Promise((resolve, reject) => {
      opentype.load("/public/futur.ttf", (err, font) => {
        if (err) {
          reject(err);
        } else {
          const path = font.getPath(
            this.character,
            0, // Initial x position
            0, // Initial y position
            this.fontSize
          );
          const boundingBox = path.getBoundingBox();
          const translateX =
            window.innerWidth / 2 - (boundingBox.x2 - boundingBox.x1) / 2;
          const translateY =
            window.innerHeight / 2 + (boundingBox.y2 - boundingBox.y1) / 2;

          // Manually translate the path
          path.commands.forEach((cmd) => {
            if (cmd.x !== undefined) cmd.x += translateX;
            if (cmd.y !== undefined) cmd.y += translateY;
            if (cmd.x1 !== undefined) cmd.x1 += translateX;
            if (cmd.y1 !== undefined) cmd.y1 += translateY;
            if (cmd.x2 !== undefined) cmd.x2 += translateX;
            if (cmd.y2 !== undefined) cmd.y2 += translateY;
          });

          this.path = path.toPathData();
          resolve(this.path);
        }
      });
    });
  }

  convertPathToPoints(pathData) {
    const svgNamespace = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNamespace, "svg");
    const pathElement = document.createElementNS(svgNamespace, "path");
    pathElement.setAttribute("d", pathData);
    svg.appendChild(pathElement);

    const points = [];
    const pathLength = pathElement.getTotalLength();
    const numPoints = 100; // Number of points to sample along the path

    for (let i = 0; i <= numPoints; i++) {
      const point = pathElement.getPointAtLength((i * pathLength) / numPoints);
      points.push({ x: point.x, y: point.y });
    }

    return points;
  }
}
