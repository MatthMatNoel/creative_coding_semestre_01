import BaseApp from "./BaseApp";
import Utils from "./Utils";
import Particle from "./Particle";
import Letter from "./Letter";

export default class App extends BaseApp {
  constructor() {
    super();
    this.paths = [];
    this.particles = [];
    this.numMaxParticles = 4000;
    this.mouse = { x: 0, y: 0 };
    this.particlesPerFrame = 5; // Number of particles to spawn per frame
    this.particlesSpawnY = 0;
    this.particlesSpawnX = Math.random() * this.width;
    this.brushSize = 200;

    this.loadSVGPath();
    this.draw();
  }

  // Pour cette partie, j'ai pas mal utilisé copilot pour charger des lettres de façon random et les convertir en SVG
  // Mais ça pourrait tout autant bien marché avec un fichier SVG que l'on charge manuellement
  async loadSVGPath() {
    try {
      const letter = new Letter(750);
      await letter.loadFont();
      this.paths = [letter.convertPathToPoints(letter.path)];
      console.log("Letter path loaded:", this.paths);
    } catch (error) {
      console.error("Failed to load letter path:", error);
    }
  }

  // Vérifie si un point donné (x,y) se trouve à l'intérieur du chemin SVG
  // en utilisant l'algorithme du nombre d'intersections pair/impair
  isPointInPath(x, y) {
    if (this.paths.length === 0) return false;

    const path = this.paths[0];
    let inside = false;

    // Cet algorithme vérifie si un point est à l'intérieur d'une forme en comptant
    // le nombre de fois qu'un rayon partant du point intersecte les bords de la forme
    // Si le nombre d'intersections est impair, le point est à l'intérieur
    for (let i = 0; i < path.length; i++) {
      // Récupère le point actuel et le point précédent pour former un bord
      const currentPoint = path[i];
      const previousPoint = i === 0 ? path[path.length - 1] : path[i - 1];

      // Vérifie si la coordonnée Y du point est entre les coordonnées Y du bord
      const isYBetween = currentPoint.y > y !== previousPoint.y > y;

      if (isYBetween) {
        // Calcule où le rayon intersecte avec le bord
        const intersectionX =
          previousPoint.x +
          ((currentPoint.x - previousPoint.x) * (y - previousPoint.y)) /
            (currentPoint.y - previousPoint.y);

        // Si le rayon intersecte à gauche de notre point, inverse intérieur/extérieur
        if (x < intersectionX) {
          inside = !inside;
        }
      }
    }

    return inside;
  }

  draw() {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Add new particles periodically
    for (let i = 0; i < this.particlesPerFrame; i++) {
      if (this.particles.length < this.numMaxParticles) {
        const x = this.particlesSpawnX;
        const y = this.particlesSpawnY;
        this.particles.push(new Particle(x, y));
      }
    }

    this.particles = this.particles.filter((particle) => {
      particle.update();

      // Check if the particle is inside the SVG path
      if (this.isPointInPath(particle.x, particle.y)) {
        // Bounce off the path
        particle.vx *= -0.5;
        particle.vy *= -0.5;
      }

      particle.draw(this.ctx);

      // Remove particle if it is dead
      return !particle.isDead();
    });

    // Change gravity when the mouse is pressed
    if (this.mouse.isPressed) {
      this.particles.forEach((particle) => {
        particle.gravity = -0.1;
        this.particlesSpawnY =
          this.mouse.y + (Math.random() - 0.5) * this.brushSize;
        this.particlesSpawnX =
          this.mouse.x + (Math.random() - 0.5) * this.brushSize;
      });
    } else {
      this.particles.forEach((particle) => {
        particle.gravity = 0.1;
        this.particlesSpawnY = 0;
        this.particlesSpawnX = Math.random() * this.width;
      });
    }

    requestAnimationFrame(this.draw.bind(this));
  }
}
