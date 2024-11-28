export default class GridOverlay {
  constructor(columns = 10, rows = 10) {
    this.columns = columns;
    this.rows = rows;
    this.borderRadius = 0;
    this.previousColorData = new Array(columns * rows).fill([0, 0, 0, 0]);
    this.sameColorCounter = new Array(columns * rows).fill(0);
  }

  draw(ctx, videoElement, glitchToggle) {
    if (!videoElement) return;

    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const cellWidth = width / this.columns;
    const cellHeight = height / this.rows;

    // Dessiner d'abord l'image de la webcam sur le canvas
    ctx.drawImage(videoElement, 0, 0, width, height);

    // Créer un tableau pour stocker les couleurs
    const colorData = new Array(this.columns * this.rows);

    // Échantillonner d'abord toutes les couleurs
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        const x = col * cellWidth;
        const y = row * cellHeight;

        // Obtenir la couleur du centre de chaque cellule
        const centerX = Math.floor(x + cellWidth / 2);
        const centerY = Math.floor(y + cellHeight / 2);

        // Échantillonner la couleur directement depuis le canvas
        const pixel = ctx.getImageData(centerX, centerY, 1, 1).data;
        colorData[row * this.columns + col] = pixel;
      }
    }

    // Effacer le canvas
    ctx.clearRect(0, 0, width, height);

    // Dessiner les rectangles avec les couleurs échantillonnées
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        const x = col * cellWidth;
        const y = row * cellHeight;
        const pixel = colorData[row * this.columns + col];
        const prevPixel = this.previousColorData[row * this.columns + col];
        const index = row * this.columns + col;

        let rectWidth = cellWidth;
        let rectHeight = cellHeight;

        if (this.isApproxSameColor(pixel, prevPixel)) {
          this.sameColorCounter[index]++;
          const traileLenght = 20;
          if (!glitchToggle) {
            const scaleFactor =
              1 - Math.min(this.sameColorCounter[index] / traileLenght, 1);
            rectWidth *= scaleFactor;
            rectHeight *= scaleFactor;
          }
          if (this.sameColorCounter[index] >= traileLenght) {
            // ctx.fillStyle = `rgb(255, 255, 255)`;
            // rectWidth = 2;
            // rectHeight = 2;
          } else {
            ctx.fillStyle = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
          }
        } else {
          this.sameColorCounter[index] = 0;
          ctx.fillStyle = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
        }

        // Dessiner le rectangle arrondi
        this.roundRect(ctx, x, y, rectWidth, rectHeight, this.borderRadius);
      }
    }

    // Mettre à jour les données de couleur précédentes
    this.previousColorData = colorData;
  }

  // Méthode auxiliaire pour dessiner des rectangles arrondis
  roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
  }

  // get luminosity calculated from rgb of a color
  // https://www.w3.org/TR/WCAG20/#relativeluminancedef
  getLuminance(rgb) {
    return (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255;
  }

  isApproxSameColor(color1, color2, threshold = 100) {
    const distance = Math.sqrt(
      Math.pow(color1[0] - color2[0], 2) +
        Math.pow(color1[1] - color2[1], 2) +
        Math.pow(color1[2] - color2[2], 2)
    );
    return distance < threshold;
  }
}
