/**
 * =========================================================================
 * RECURSIVE FRACTAL TREE ENGINE
 * =========================================================================
 * Full Lifecycle: CLOSED → GROW → FULL TREE → HOLD → SMOOTH COMPLETE CLOSE → CLOSED
 * Features:
 * - Mathematically continuous branch-by-branch growth & reverse retraction
 * - Outer twigs retract first into parent nodes, leaving zero residual branches
 * - Balanced medium scale (+45%) tailored for circular viewport
 * - Transparent background with luminous glowing strokes and cyan root aura
 * - Real-time smooth interactive mouse / touch tracking
 */

class FractalTreeEngine {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext("2d");
    this.maxDepth = 9;
    this.minAngle = (14 * Math.PI) / 180;  // 14° (compact closed angle)
    this.maxAngle = (35 * Math.PI) / 180;  // 35° (lush open canopy angle)
    this.minRatio = 0.64;
    this.maxRatio = 0.69;
    this.cycleDuration = 9.0;              // 9-second full organic lifecycle

    this.angle = this.minAngle;
    this.targetAngle = this.minAngle;
    this.ratio = this.minRatio;
    this.targetRatio = this.minRatio;
    this.growthLevel = 0.0;
    this.targetGrowth = 0.0;

    this.time = 0;
    this.lastTimestamp = 0;
    this.animId = null;
    this.isRunning = false;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.mouse = {
      isHovering: false,
      influenceGrowth: null,
      influenceAngle: null,
      influenceRatio: null
    };

    this.init();
  }

  init() {
    this.setupEvents();
    this.resizeCanvas();
  }

  setupEvents() {
    window.addEventListener("resize", () => {
      if (this.isRunning) this.resizeCanvas();
    });

    const handlePointerMove = (clientX, clientY) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const normX = Math.max(0, Math.min(1, x / rect.width));
      const normY = Math.max(0, Math.min(1, y / rect.height));

      // Left = closed (0 growth, 14°), Right = fully bloomed (9 depth, 36°)
      this.mouse.influenceGrowth = normX * this.maxDepth;
      this.mouse.influenceAngle = this.minAngle + normX * (this.maxAngle - this.minAngle);
      this.mouse.influenceRatio = this.minRatio + (1 - normY) * (this.maxRatio - this.minRatio);
      this.mouse.isHovering = true;
    };

    this.canvas.addEventListener("mousemove", (e) => {
      handlePointerMove(e.clientX, e.clientY);
    });

    this.canvas.addEventListener("mouseleave", () => {
      this.mouse.isHovering = false;
      this.mouse.influenceGrowth = null;
      this.mouse.influenceAngle = null;
      this.mouse.influenceRatio = null;
    });

    this.canvas.addEventListener("touchmove", (e) => {
      if (e.touches.length > 0) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    this.canvas.addEventListener("touchend", () => {
      this.mouse.isHovering = false;
      this.mouse.influenceGrowth = null;
      this.mouse.influenceAngle = null;
      this.mouse.influenceRatio = null;
    });
  }

  resizeCanvas() {
    const parent = this.canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const width = Math.max(260, rect.width || 440);
    const height = Math.max(260, rect.height || 440);

    this.canvas.width = width * this.dpr;
    this.canvas.height = height * this.dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(this.dpr, this.dpr);
    this.displayW = width;
    this.displayH = height;

    // Existing fit calculation inside circular viewport with +45% balanced scale
    const baseFit = Math.min(width, height) * 0.145;
    const sizeAdjustmentFactor = 1.45;
    this.trunkLength = baseFit * sizeAdjustmentFactor;
  }

  // Mathematically continuous recursive branch rendering with smooth branch-by-branch retraction
  branch(len, angle, ratio, level, maxDepth, growthLevel) {
    if (growthLevel <= level) return;

    // Fraction of current branch level extended: 0.0 to 1.0
    const levelFraction = Math.min(1, Math.max(0, growthLevel - level));
    // Smooth cubic Hermite curve for natural organic deceleration
    const easedGrowth = levelFraction * levelFraction * (3 - 2 * levelFraction);

    const currentLen = len * easedGrowth;
    if (currentLen <= 0.05) return;

    const depthProgress = (maxDepth - level) / maxDepth;
    const alpha = Math.min(1, (0.35 + depthProgress * 0.65) * Math.min(1, easedGrowth * 1.4));
    const lineWidth = Math.max(0.9, depthProgress * 3.8 * Math.min(1, 0.4 + easedGrowth * 0.6));

    // Luminous glowing silver-white branch stroke
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(0, -currentLen);
    this.ctx.strokeStyle = `rgba(240, 246, 252, ${alpha})`;
    this.ctx.lineWidth = lineWidth;
    this.ctx.lineCap = "round";
    this.ctx.stroke();

    // Active tip glowing bud
    const isTip = (growthLevel < level + 1) || (level === maxDepth - 1);
    if (isTip && easedGrowth > 0.1) {
      this.ctx.save();
      this.ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
      this.ctx.shadowColor = "rgba(56, 189, 248, 0.85)";
      this.ctx.shadowBlur = 5 * easedGrowth;
      this.ctx.beginPath();
      this.ctx.arc(0, -currentLen, 1.4 * Math.min(1, easedGrowth * 1.2), 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    // Recurse into child branches only if growth extends beyond this level
    if (growthLevel > level + 1 && level < maxDepth - 1) {
      const nextLen = len * ratio;

      // Right Branch (+angle)
      this.ctx.save();
      this.ctx.translate(0, -currentLen);
      this.ctx.rotate(angle);
      this.branch(nextLen, angle, ratio, level + 1, maxDepth, growthLevel);
      this.ctx.restore();

      // Left Branch (-angle)
      this.ctx.save();
      this.ctx.translate(0, -currentLen);
      this.ctx.rotate(-angle);
      this.branch(nextLen, angle, ratio, level + 1, maxDepth, growthLevel);
      this.ctx.restore();
    }
  }

  render(timestamp = 0) {
    if (!this.isRunning) return;

    if (!this.lastTimestamp) this.lastTimestamp = timestamp;
    const dt = Math.min((timestamp - this.lastTimestamp) / 1000, 0.1);
    this.lastTimestamp = timestamp;

    const w = this.displayW;
    const h = this.displayH;
    this.ctx.clearRect(0, 0, w, h);

    if (this.mouse.isHovering && this.mouse.influenceGrowth !== null) {
      // Interactive mouse control
      this.targetGrowth = this.mouse.influenceGrowth;
      this.targetAngle = this.mouse.influenceAngle;
      this.targetRatio = this.mouse.influenceRatio || this.minRatio;

      this.growthLevel += (this.targetGrowth - this.growthLevel) * 0.08;
      this.angle += (this.targetAngle - this.angle) * 0.08;
      this.ratio += (this.targetRatio - this.ratio) * 0.08;
    } else {
      // Automatic Lifecycle: CLOSED → GROW → FULL TREE → HOLD → SMOOTH COMPLETE CLOSE → CLOSED
      this.time += dt;
      const cycleProgress = (this.time % this.cycleDuration) / this.cycleDuration; // 0.0 to 1.0

      if (cycleProgress < 0.06) {
        // Phase 1: Closed Hold (~0.5s)
        this.targetGrowth = 0.0;
        this.targetAngle = this.minAngle;
        this.targetRatio = this.minRatio;
      } else if (cycleProgress < 0.44) {
        // Phase 2: Grow to Full Tree (~3.4s)
        const p = (cycleProgress - 0.06) / 0.38; // 0 to 1
        const eased = p * p * (3 - 2 * p); // Cubic ease-in-out
        this.targetGrowth = eased * this.maxDepth;
        this.targetAngle = this.minAngle + eased * (this.maxAngle - this.minAngle);
        this.targetRatio = this.minRatio + eased * (this.maxRatio - this.minRatio);
      } else if (cycleProgress < 0.58) {
        // Phase 3: Hold Full Tree & subtle gentle breathing (~1.3s)
        this.targetGrowth = this.maxDepth;
        const breath = Math.sin(this.time * 2.5) * 0.5 * (Math.PI / 180);
        this.targetAngle = this.maxAngle + breath;
        this.targetRatio = this.maxRatio;
      } else if (cycleProgress < 0.94) {
        // Phase 4: Smooth Complete Close (Retract branch-by-branch in reverse order) (~3.2s)
        const p = (cycleProgress - 0.58) / 0.36; // 0 to 1
        const eased = 1 - (p * p * (3 - 2 * p)); // Reverse cubic ease-in-out
        this.targetGrowth = eased * this.maxDepth;
        this.targetAngle = this.minAngle + eased * (this.maxAngle - this.minAngle);
        this.targetRatio = this.minRatio + eased * (this.maxRatio - this.minRatio);
      } else {
        // Phase 5: Closed Settle (~0.6s)
        this.targetGrowth = 0.0;
        this.targetAngle = this.minAngle;
        this.targetRatio = this.minRatio;
      }

      this.growthLevel += (this.targetGrowth - this.growthLevel) * 0.12;
      this.angle += (this.targetAngle - this.angle) * 0.10;
      this.ratio += (this.targetRatio - this.ratio) * 0.10;
    }

    // Root trunk base positioned inside lower portion of circular viewport
    const startX = w / 2;
    const startY = h * 0.76;

    // Atmospheric root aura glow
    const growthProgress = Math.min(1, this.growthLevel / 2.0);
    const aura = this.ctx.createRadialGradient(startX, startY, 4, startX, startY, Math.min(w, h) * 0.22);
    aura.addColorStop(0, `rgba(56, 189, 248, ${0.15 + growthProgress * 0.15})`);
    aura.addColorStop(0.5, `rgba(16, 185, 129, ${0.04 + growthProgress * 0.05})`);
    aura.addColorStop(1, "transparent");
    this.ctx.fillStyle = aura;
    this.ctx.fillRect(startX - w * 0.28, startY - 25, w * 0.56, 50);

    // Global matrix setup for tree rendering
    if (this.growthLevel > 0.01) {
      this.ctx.save();
      this.ctx.translate(startX, startY);
      this.ctx.shadowColor = "rgba(56, 189, 248, 0.38)";
      this.ctx.shadowBlur = 6;

      this.branch(this.trunkLength, this.angle, this.ratio, 0, this.maxDepth, this.growthLevel);

      this.ctx.restore();
    }

    this.animId = requestAnimationFrame((ts) => this.render(ts));
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTimestamp = 0;
    this.animId = requestAnimationFrame((ts) => this.render(ts));
  }

  stop() {
    this.isRunning = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }
}

window.FractalTreeEngine = FractalTreeEngine;
