/**
 * =========================================================================
 * ASCII PARTICLE AVATAR ENGINE
 * =========================================================================
 * Interactive ASCII particle effect.
 * Converts raster images or procedural avatars into glowing ASCII character
 * particles that dynamically scatter on cursor hover and snap back with spring physics.
 */

class AsciiAvatarEngine {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext("2d", { willReadFrequently: true });
    this.options = Object.assign(
      {
        asciiChars: "@%#*+=-:. ",
        density: 6,
        repelRadius: 80,
        springStrength: 0.08,
        damping: 0.85,
        fontSize: 10,
        colorMode: "original", // "original", "neon", "monochrome"
        customImageUrl: null
      },
      options
    );

    this.particles = [];
    this.mouse = { x: -9999, y: -9999, isHovering: false, radius: this.options.repelRadius };
    this.animId = null;
    this.isRunning = false;
    this.img = new Image();
    this.img.crossOrigin = "Anonymous";
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.init();
  }

  init() {
    this.setupEvents();
    this.resizeCanvas();

    const initialUrl =
      this.options.customImageUrl ||
      (window.PORTFOLIO_CONFIG && window.PORTFOLIO_CONFIG.personal.avatarUrl) ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80";

    this.loadImage(initialUrl);
  }

  setupEvents() {
    window.addEventListener("resize", () => {
      if (this.isRunning) {
        this.resizeCanvas();
        this.processImage();
      }
    });

    const getPos = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: (clientX - rect.left) * (this.canvas.width / (rect.width * this.dpr)),
        y: (clientY - rect.top) * (this.canvas.height / (rect.height * this.dpr))
      };
    };

    this.canvas.addEventListener("mousemove", (e) => {
      const pos = getPos(e);
      this.mouse.x = pos.x;
      this.mouse.y = pos.y;
      this.mouse.isHovering = true;
    });

    this.canvas.addEventListener("mouseleave", () => {
      this.mouse.x = -9999;
      this.mouse.y = -9999;
      this.mouse.isHovering = false;
    });

    this.canvas.addEventListener("touchstart", (e) => {
      const pos = getPos(e);
      this.mouse.x = pos.x;
      this.mouse.y = pos.y;
      this.mouse.isHovering = true;
    }, { passive: true });

    this.canvas.addEventListener("touchmove", (e) => {
      const pos = getPos(e);
      this.mouse.x = pos.x;
      this.mouse.y = pos.y;
      this.mouse.isHovering = true;
    }, { passive: true });

    this.canvas.addEventListener("touchend", () => {
      this.mouse.x = -9999;
      this.mouse.y = -9999;
      this.mouse.isHovering = false;
    });
  }

  resizeCanvas() {
    const parent = this.canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const width = Math.min(rect.width || 420, 460);
    const height = Math.min(rect.height || 420, 460);

    this.canvas.width = width * this.dpr;
    this.canvas.height = height * this.dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.ctx.scale(this.dpr, this.dpr);
    this.displayW = width;
    this.displayH = height;
  }

  loadImage(url) {
    this.img = new Image();
    this.img.crossOrigin = "Anonymous";
    this.img.onload = () => {
      this.processImage();
      this.start();
    };
    this.img.onerror = () => {
      console.warn("Could not load external image; generating procedural avatar.");
      this.createProceduralAvatar();
      this.processImage();
      this.start();
    };
    this.img.src = url;
  }

  loadCustomImageFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.loadImage(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  createProceduralAvatar() {
    const offCanvas = document.createElement("canvas");
    offCanvas.width = 300;
    offCanvas.height = 300;
    const ctx = offCanvas.getContext("2d");

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 300, 300);
    grad.addColorStop(0, "#10b981");
    grad.addColorStop(0.5, "#6366f1");
    grad.addColorStop(1, "#ec4899");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 300, 300);

    // Modern geometric portrait
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(150, 115, 60, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.beginPath();
    ctx.arc(150, 270, 95, Math.PI, 0, false);
    ctx.fill();

    // Code brackets overlay
    ctx.fillStyle = "#1e1b4b";
    ctx.font = "bold 32px monospace";
    ctx.textAlign = "center";
    ctx.fillText("</>", 150, 125);

    this.img = offCanvas;
  }

  processImage() {
    this.particles = [];
    const w = this.displayW;
    const h = this.displayH;
    if (!w || !h) return;

    // Offscreen sampling canvas
    const sampleCanvas = document.createElement("canvas");
    const sampleCtx = sampleCanvas.getContext("2d", { willReadFrequently: true });
    sampleCanvas.width = w;
    sampleCanvas.height = h;

    // Center crop & circular clip image into sampling canvas
    const imgAspect = (this.img.width || 1) / (this.img.height || 1);
    const canvasAspect = w / h;
    let sw = w;
    let sh = h;
    let sx = 0;
    let sy = 0;

    const size = Math.min(w, h) * 0.84;
    const offsetX = (w - size) / 2;
    const offsetY = (h - size) / 2;

    sampleCtx.save();
    sampleCtx.beginPath();
    sampleCtx.arc(w / 2, h / 2, size / 2, 0, Math.PI * 2);
    sampleCtx.closePath();
    sampleCtx.clip();

    try {
      sampleCtx.drawImage(this.img, offsetX, offsetY, size, size);
    } catch (e) {
      console.error(e);
      return;
    }
    sampleCtx.restore();

    const imgData = sampleCtx.getImageData(0, 0, w, h);
    const data = imgData.data;
    const chars = this.options.asciiChars;
    const density = Math.max(4, this.options.density);

    for (let y = 0; y < h; y += density) {
      for (let x = 0; x < w; x += density) {
        const index = (y * w + x) * 4;
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        const a = data[index + 3];

        if (a > 40) {
          // Standard relative luminance
          const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          const charIndex = Math.floor((1 - brightness) * (chars.length - 1));
          const char = chars[Math.min(charIndex, chars.length - 1)] || ".";

          let color;
          if (this.options.colorMode === "neon") {
            color = `hsl(${(brightness * 120 + 160) % 360}, 90%, ${Math.max(45, brightness * 80)}%)`;
          } else if (this.options.colorMode === "monochrome") {
            color = `rgb(${Math.round(brightness * 255)}, ${Math.round(brightness * 255)}, ${Math.round(brightness * 255)})`;
          } else {
            color = `rgb(${r}, ${g}, ${b})`;
          }

          this.particles.push({
            originX: x,
            originY: y,
            x: x + (Math.random() - 0.5) * 40,
            y: y + (Math.random() - 0.5) * 40,
            vx: 0,
            vy: 0,
            char: char,
            color: color,
            brightness: brightness,
            size: this.options.fontSize * (0.8 + brightness * 0.4),
            mass: 1 + Math.random() * 0.5,
            idleOffset: Math.random() * Math.PI * 2
          });
        }
      }
    }
  }

  updatePhysics(time) {
    const { repelRadius, springStrength, damping } = this.options;
    const isDark = document.documentElement.classList.contains("dark") || !document.documentElement.classList.contains("light");

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Subtle idle breathing
      const idleX = Math.sin(time * 0.002 + p.idleOffset) * 0.6;
      const idleY = Math.cos(time * 0.002 + p.idleOffset) * 0.6;

      const targetX = p.originX + idleX;
      const targetY = p.originY + idleY;

      // Mouse repulsion vector
      const dx = p.x - this.mouse.x;
      const dy = p.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < repelRadius && dist > 0) {
        const force = (repelRadius - dist) / repelRadius;
        const angle = Math.atan2(dy, dx);
        const repelForce = force * 14 * (1 / p.mass);
        p.vx += Math.cos(angle) * repelForce;
        p.vy += Math.sin(angle) * repelForce;
      }

      // Hooke's law spring return
      const springX = (targetX - p.x) * springStrength;
      const springY = (targetY - p.y) * springStrength;

      p.vx = (p.vx + springX) * damping;
      p.vy = (p.vy + springY) * damping;

      p.x += p.vx;
      p.y += p.vy;
    }
  }

  render(time) {
    if (!this.isRunning) return;

    this.ctx.clearRect(0, 0, this.displayW, this.displayH);
    this.updatePhysics(time);

    const isLight = document.documentElement.classList.contains("light");
    this.ctx.font = `600 ${this.options.fontSize}px "Fira Code", monospace`;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      
      this.ctx.fillStyle = p.color;
      
      // Slight glow on high brightness particles
      if (p.brightness > 0.7 && !isLight) {
        this.ctx.shadowColor = p.color;
        this.ctx.shadowBlur = 4;
      } else {
        this.ctx.shadowBlur = 0;
      }

      this.ctx.fillText(p.char, p.x, p.y);
    }
    this.ctx.shadowBlur = 0;

    this.animId = requestAnimationFrame((t) => this.render(t));
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animId = requestAnimationFrame((t) => this.render(t));
  }

  stop() {
    this.isRunning = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  setCharPreset(presetName) {
    const presets = {
      classic: "@%#*+=-:. ",
      binary: "10 ",
      matrix: "0123456789ABCDEF!@#$ ",
      blocks: "█▓▒░ ",
      minimal: "◆▲●■★· "
    };
    this.options.asciiChars = presets[presetName] || presets.classic;
    this.processImage();
  }

  setDensity(density) {
    this.options.density = density;
    this.processImage();
  }

  setColorMode(mode) {
    this.options.colorMode = mode;
    this.processImage();
  }

  scatterAll() {
    for (let p of this.particles) {
      p.vx += (Math.random() - 0.5) * 45;
      p.vy += (Math.random() - 0.5) * 45;
    }
  }
}

window.AsciiAvatarEngine = AsciiAvatarEngine;
