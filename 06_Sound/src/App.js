import BaseApp from "./BaseApp";
export default class App extends BaseApp {
  constructor() {
    super();
    // Fichier audio à charger
    this.audioFile = "./choir.mp3";
    // Création de l'élément audio HTML
    this.audio = new Audio(this.audioFile);
    // this.audio.controls = true;
    this.audio.loop = true;
    document.body.appendChild(this.audio);
    this.isPlaying = false;

    this.gainValue = 10;
    this.letterX = 0;
    this.letters = []; // Array to store letter positions
    this.init();
  }

  init() {
    document.addEventListener("click", (e) => {
      if (!this.audioContext) {
        // On vérifie si le contexte audio est disponible
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        // on récupère le contexte audio
        this.audioContext = new AudioContext();
        //
        this.setup();
      }

      if (this.isPlaying) {
        this.audio.pause();
        this.isPlaying = false;
      } else {
        this.audio.play();
        this.isPlaying = true;
      }
    });
  }

  setup() {
    // on crée un noeud source
    this.source = this.audioContext.createMediaElementSource(this.audio);

    // on crée un noeud de gain
    this.gain = this.audioContext.createGain();
    this.source.connect(this.gain);

    // on crée un noeud de filtre
    this.filter = this.audioContext.createBiquadFilter();
    this.filter.type = "lowpass"; // You can change the filter type if needed
    this.gain.connect(this.filter);

    // on crée un noeud d'analyse
    this.analyser = this.audioContext.createAnalyser();
    // crée un noeud de destination
    this.destination = this.audioContext.destination;
    // on connecte le noeud source à l'analyseur
    this.filter.connect(this.analyser);
    // on connecte l'analyseur à la destination
    this.analyser.connect(this.destination);
    // on definie la taille du buffer
    this.analyser.fftSize = 2048;
    // on crée un tableau de données pour l'anayse de frequences (en Byte)
    this.dataArray = new Uint8Array(this.analyser.fftSize);
    // on crée un tableau de données pour l'anayse de waveform (en Byte)
    this.waveArray = new Uint8Array(this.analyser.fftSize);

    this.draw();
  }

  // on crée une méthode pour analyser les données de waveform
  analyseWaveform() {
    this.analyser.getByteTimeDomainData(this.waveArray);
  }

  modifyAudio() {
    document.addEventListener("mousemove", (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      this.gainValue =
        ((window.innerHeight - mouseY) / window.innerHeight) * 10;
      this.gain.gain.value = this.gainValue;

      this.frequency = (mouseX / window.innerWidth) * 20000; // Frequency range from 0 to 20000 Hz
      this.filter.frequency.value = this.frequency;
      const playbackRate = (mouseX / window.innerWidth) * 2; // Playback rate range from 0 to 2

      this.audio.playbackRate = Math.max(playbackRate, 0.1);
    });
  }

  draw() {
    this.analyseWaveform();
    this.modifyAudio();

    this.ctx.globalCompositeOperation = "normal";

    this.ctx.fillStyle = "rgba(0, 0, 0, 1)";
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw letters
    let fontHeight = this.gainValue * 15;
    let fontWidth = 10 + (20000 - this.frequency) / 500;
    this.ctx.fillStyle = "white";
    this.ctx.font = `10px poppins`;
    const text = "O";

    // Add new letter at regular intervals
    const letterSpacing = fontWidth * 6; // Adjust the multiplier as needed
    if (
      this.letters.length === 0 ||
      this.letters[this.letters.length - 1].x < this.width - letterSpacing
    ) {
      this.letters.push({
        x: this.width,
        y: this.height / 2,
        fontWidth,
        fontHeight,
      });
    }

    // Update and draw each letter
    this.letters.forEach((letter, index) => {
      letter.x -= this.gainValue * 10;

      // Measure text
      const textMetrics = this.ctx.measureText(text);
      const textWidth = textMetrics.width;
      const textHeight =
        textMetrics.actualBoundingBoxAscent +
        textMetrics.actualBoundingBoxDescent;

      this.ctx.save();
      this.ctx.translate(letter.x, letter.y);
      this.ctx.scale(letter.fontWidth, letter.fontHeight);
      this.ctx.fillText(text, -textWidth / 2, textHeight / 2);
      this.ctx.restore();

      if (letter.x < -textWidth) {
        this.letters.splice(index, 1);
      }
    });

    // visualisation de la waveform
    const waveSpace = this.width / this.waveArray.length;
    this.ctx.globalCompositeOperation = "difference";
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.height / 2);

    if (!this.smoothedWaveArray) {
      this.smoothedWaveArray = new Float32Array(this.waveArray.length);
    }

    for (let i = 0; i < this.waveArray.length; i++) {
      this.smoothedWaveArray[i] = this.lerp(
        this.smoothedWaveArray[i] || 0,
        this.waveArray[i],
        0.2
      );
    }

    for (let i = 0; i < this.smoothedWaveArray.length; i++) {
      const y =
        (this.smoothedWaveArray[i] / 128) * this.height - this.height / 2;
      this.ctx.lineTo(i * waveSpace, y);
    }
    this.ctx.strokeStyle = "white";
    this.ctx.lineWidth = 3;
    this.ctx.stroke();

    requestAnimationFrame(this.draw.bind(this));
  }

  // Lerp function
  lerp(start, end, ratio) {
    return start + ratio * (end - start);
  }
}
