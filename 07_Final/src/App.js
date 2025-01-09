import BaseApp from "./BaseApp";
import Particle from "./Particle.js";
import WebcamManager from "./WebcamManager";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

export default class App extends BaseApp {
  constructor() {
    super();

    this.webcamManager = new WebcamManager();

    this.particles = [];
    this.particlesPerFrame = 1; // Number of particles to spawn per frame
    this.numMaxParticles = 4000;
    this.particlesSpawnY;
    this.particlesSpawnX;
    this.frameCount = 0;

    this.faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });
    this.faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    this.faceMesh.onResults(this.onResults.bind(this));

    this.faceMeshPoints = [];

    this.inti();
  }

  async inti() {
    await this.webcamManager.initialize();
    this.camera = new Camera(this.webcamManager.getVideo(), {
      onFrame: async () => {
        await this.faceMesh.send({ image: this.webcamManager.getVideo() });
      },
      width: 640,
      height: 480,
    });
    this.camera.start();
    this.draw();
  }

  onResults(results) {
    this.faceMeshPoints = results.multiFaceLandmarks[0] || [];
  }

  draw() {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.handleParticles();
    this.handleCamera();

    this.frameCount++; // Increment frame counter
    requestAnimationFrame(this.draw.bind(this));
  }

  handleParticles() {
    // Add new particles periodically
    for (let i = 0; i < this.particlesPerFrame; i++) {
      if (this.particles.length < this.numMaxParticles) {
        const x = this.particlesSpawnX;
        const y = this.particlesSpawnY;
        this.particles.push(new Particle(x, y));
      }
    }

    this.particles.forEach((particle) => {
      this.particlesSpawnY = 0;
      this.particlesSpawnX = Math.random() * this.width;

      // Apply repulsion force from face mesh points
      this.faceMeshPoints.forEach((point) => {
        const x = point.x * this.width;
        const y = point.y * this.height;
        particle.repulse(x, y);
      });
    });

    // // Spawn particles at eye points every 10 frames
    // if (this.frameCount % 10 === 0) {
    //   this.faceMeshPoints.forEach((point, index) => {
    //     if (index === 468 || index === 473) {
    //       const x = point.x * this.width;
    //       const y = point.y * this.height;
    //       this.particles.push(new Particle(x, y));
    //     }
    //   });
    // }

    this.particles = this.particles.filter((particle) => {
      particle.update();

      particle.draw(this.ctx);

      // Remove particle if it is dead
      return !particle.isDead();
    });
  }

  handleCamera() {
    // const video = this.webcamManager.getVideo();
    // this.ctx.drawImage(video, 0, 0, this.width, this.height);

    // Draw face mesh points
    this.faceMeshPoints.forEach((point, index) => {
      this.ctx.fillStyle = "rgb(0, 255, 0)";
      this.ctx.beginPath();
      this.ctx.arc(
        point.x * this.width,
        point.y * this.height,
        1,
        0,
        2 * Math.PI
      );
      this.ctx.fill();

      // if (index === 468 || index === 473) {
      //   // Indices for the eyes
      //   this.ctx.fillStyle = "red";
      //   this.ctx.beginPath();
      //   this.ctx.arc(
      //     point.x * this.width,
      //     point.y * this.height,
      //     20,
      //     0,
      //     2 * Math.PI
      //   );
      //   this.ctx.fill();
      // } else {
      //   this.ctx.fillStyle = "rgb(0, 255, 0)";
      //   this.ctx.beginPath();
      //   this.ctx.arc(
      //     point.x * this.width,
      //     point.y * this.height,
      //     1,
      //     0,
      //     2 * Math.PI
      //   );
      //   this.ctx.fill();
      // }
    });
  }
}
