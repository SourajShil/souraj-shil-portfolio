/**
 * =========================================================================
 * INTERACTIVE PLAYGROUND / NEURAL SANDBOX
 * =========================================================================
 * A playful interactive neural physics sandbox.
 */

class NeuralPlayground {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext("2d");
    this.options = Object.assign(
      {
        initialNodes: 35,
        maxNodes: 80,
        connectionDistance: 110,
        mode: "attract" // "attract", "repel", "orbit"
      },
      options
    );

    this.nodes = [];
    this.mouse = { x: -9999, y: -9999, isDown: false };
    this.score = 0;
    this.animId = null;
    this.isRunning = false;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.init();
  }

  init() {
    this.setupEvents();
    this.resizeCanvas();
    this.populateNodes();
    this.start();
  }

  setupEvents() {
    window.addEventListener("resize", () => {
      if (this.isRunning) {
        this.resizeCanvas();
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
    });

    this.canvas.addEventListener("mousedown", (e) => {
      this.mouse.isDown = true;
      const pos = getPos(e);
      this.spawnBurst(pos.x, pos.y, 4);
    });

    this.canvas.addEventListener("mouseup", () => {
      this.mouse.isDown = false;
    });

    this.canvas.addEventListener("mouseleave", () => {
      this.mouse.x = -9999;
      this.mouse.y = -9999;
      this.mouse.isDown = false;
    });

    this.canvas.addEventListener("touchstart", (e) => {
      const pos = getPos(e);
      this.mouse.x = pos.x;
      this.mouse.y = pos.y;
      this.spawnBurst(pos.x, pos.y, 3);
    }, { passive: true });

    this.canvas.addEventListener("touchmove", (e) => {
      const pos = getPos(e);
      this.mouse.x = pos.x;
      this.mouse.y = pos.y;
    }, { passive: true });

    this.canvas.addEventListener("touchend", () => {
      this.mouse.x = -9999;
      this.mouse.y = -9999;
    });
  }

  resizeCanvas() {
    const parent = this.canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const width = rect.width || 700;
    const height = Math.max(300, rect.height || 360);

    this.canvas.width = width * this.dpr;
    this.canvas.height = height * this.dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.ctx.scale(this.dpr, this.dpr);
    this.displayW = width;
    this.displayH = height;
  }

  populateNodes() {
    this.nodes = [];
    const colors = ["#10b981", "#06b6d4", "#8b5cf6", "#f43f5e", "#f59e0b"];
    const w = this.displayW || 600;
    const h = this.displayH || 300;

    for (let i = 0; i < this.options.initialNodes; i++) {
      this.nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: 3 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        mass: 1 + Math.random() * 1.2,
        pulse: Math.random() * Math.PI * 2
      });
    }
  }

  spawnBurst(x, y, count = 5) {
    const colors = ["#10b981", "#06b6d4", "#8b5cf6", "#f43f5e", "#f59e0b"];
    this.score += count;
    this.updateScoreUI();

    for (let i = 0; i < count; i++) {
      if (this.nodes.length >= this.options.maxNodes) {
        this.nodes.shift();
      }
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 4;
      this.nodes.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 3.5 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        mass: 1 + Math.random(),
        pulse: Math.random() * Math.PI * 2
      });
    }
  }

  updateScoreUI() {
    const el = document.getElementById("playground-energy-counter");
    if (el) {
      el.textContent = `${this.score} Brainwaves`;
    }
  }

  updatePhysics() {
    const w = this.displayW;
    const h = this.displayH;
    const { mode } = this.options;

    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      node.pulse += 0.04;

      // Mouse influence
      if (this.mouse.x > 0 && this.mouse.y > 0) {
        const dx = this.mouse.x - node.x;
        const dy = this.mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 180 && dist > 5) {
          const angle = Math.atan2(dy, dx);
          const force = (180 - dist) / 180;

          if (mode === "attract") {
            const pull = force * 0.7;
            node.vx += Math.cos(angle) * pull;
            node.vy += Math.sin(angle) * pull;
          } else if (mode === "repel") {
            const push = force * 1.8;
            node.vx -= Math.cos(angle) * push;
            node.vy -= Math.sin(angle) * push;
          } else if (mode === "orbit") {
            const perpAngle = angle + Math.PI / 2;
            node.vx += Math.cos(perpAngle) * 0.9 + Math.cos(angle) * 0.3;
            node.vy += Math.sin(perpAngle) * 0.9 + Math.sin(angle) * 0.3;
          }
        }
      }

      // Air friction
      node.vx *= 0.985;
      node.vy *= 0.985;

      node.x += node.vx;
      node.y += node.vy;

      // Wall bounce
      if (node.x < node.radius) {
        node.x = node.radius;
        node.vx *= -0.8;
      }
      if (node.x > w - node.radius) {
        node.x = w - node.radius;
        node.vx *= -0.8;
      }
      if (node.y < node.radius) {
        node.y = node.radius;
        node.vy *= -0.8;
      }
      if (node.y > h - node.radius) {
        node.y = h - node.radius;
        node.vy *= -0.8;
      }
    }
  }

  render() {
    if (!this.isRunning) return;

    const w = this.displayW;
    const h = this.displayH;
    this.ctx.clearRect(0, 0, w, h);

    this.updatePhysics();

    const isDark = document.documentElement.classList.contains("dark") || !document.documentElement.classList.contains("light");

    // Draw connecting synapses
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const n1 = this.nodes[i];
        const n2 = this.nodes[j];
        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.options.connectionDistance) {
          const alpha = (1 - dist / this.options.connectionDistance) * (isDark ? 0.35 : 0.2);
          this.ctx.beginPath();
          this.ctx.moveTo(n1.x, n1.y);
          this.ctx.lineTo(n2.x, n2.y);
          this.ctx.strokeStyle = isDark ? `rgba(148, 163, 184, ${alpha})` : `rgba(71, 85, 105, ${alpha})`;
          this.ctx.lineWidth = Math.max(0.6, (1 - dist / this.options.connectionDistance) * 1.5);
          this.ctx.stroke();
        }
      }
    }

    // Draw nodes
    for (let node of this.nodes) {
      const currentRadius = node.radius + Math.sin(node.pulse) * 1;
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = node.color;
      
      if (isDark) {
        this.ctx.shadowColor = node.color;
        this.ctx.shadowBlur = 8;
      }
      this.ctx.fill();
      this.ctx.restore();
    }

    this.animId = requestAnimationFrame(() => this.render());
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animId = requestAnimationFrame(() => this.render());
  }

  stop() {
    this.isRunning = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  setMode(mode) {
    this.options.mode = mode;
  }

  explode() {
    const w = this.displayW;
    const h = this.displayH;
    for (let node of this.nodes) {
      const angle = Math.random() * Math.PI * 2;
      const force = 5 + Math.random() * 8;
      node.vx = Math.cos(angle) * force;
      node.vy = Math.sin(angle) * force;
    }
    this.score += 20;
    this.updateScoreUI();
  }

  reset() {
    this.populateNodes();
  }
}

window.NeuralPlayground = NeuralPlayground;
