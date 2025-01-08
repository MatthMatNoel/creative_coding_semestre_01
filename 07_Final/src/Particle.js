export default class Particle {
  /**
   * Crée une nouvelle particule avec une position et une vélocité aléatoire
   * @param {number} x - Position initiale en X
   * @param {number} y - Position initiale en Y
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.radius = Math.random() * 2 + 2;
    this.friction = 0.98;
    this.age = 0;
    this.lifespan = 400; // Lifespan in frames
    this.gravity = 0.1; // Gravity force
    this.maxSpeed = Math.random() * 3 + 2; // Random max speed
    this.r = 0;
    this.g = Math.floor(Math.random() * 255);
    this.b = 0;
    this.characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    this.character =
      this.characters[Math.floor(Math.random() * this.characters.length)];
  }

  /**
   * Met à jour la position et la vélocité de la particule
   * - Ajoute un mouvement aléatoire
   * - Applique la friction
   * - Limite la vitesse maximale
   * - Met à jour l'état de répulsion
   */
  update() {
    // Apply gravity
    this.vy += this.gravity;
    // this.vx += Math.random() - 0.5;

    // Apply friction
    this.vx *= this.friction;
    this.vy *= this.friction;

    // Limit speed
    const speed = Math.hypot(this.vx, this.vy);
    if (speed > this.maxSpeed) {
      const scale = this.maxSpeed / speed;
      this.vx *= scale;
      this.vy *= scale;
    }

    // Update position
    this.x += this.vx;
    this.y += this.vy;

    // Increment age
    this.age++;
  }

  /**
   * Vérifie si la particule est morte (a dépassé sa durée de vie)
   * @returns {boolean} - True si la particule est morte, sinon false
   */
  isDead() {
    return this.age >= this.lifespan;
  }

  /**
   * Dessine la particule sur le canvas
   * La couleur change selon si la particule est repoussée ou non
   * @param {CanvasRenderingContext2D} ctx - Le contexte de rendu 2D
   */
  draw(ctx) {
    ctx.font = `15px Futura`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.character, this.x, this.y);

    // ctx.beginPath();
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

    // Changer la couleur en fonction de l'état
    ctx.fillStyle = `rgb(${this.r}, ${this.g}, ${this.b})`;
    ctx.fill();
  }
}
