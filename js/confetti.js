/**
 * LCC Game - Animasi Konfeti Keraian (Celebratory Confetti Animation)
 * 100% Vanilla JavaScript & HTML5 Canvas, bebas dependensi luaran / internet.
 */

class ConfettiManager {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.animId = null;
    this.isRunning = false;
    this.colors = [
      '#ef4444', '#f97316', '#f59e0b', '#10b981', 
      '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', 
      '#ec4899', '#f43f5e', '#eab308', '#22c55e'
    ];
  }

  init() {
    if (this.canvas) return;
    this.canvas = document.getElementById('confetti-canvas');
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'confetti-canvas';
      document.body.appendChild(this.canvas);
    }
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  start(durationMs = 6000) {
    this.init();
    this.stop();
    this.isRunning = true;
    this.canvas.style.display = 'block';

    const particleCount = 150;
    this.particles = [];
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Cipta zarah konfeti dengan letusan dari dua sisi bawah skrin
    for (let i = 0; i < particleCount; i++) {
      const isLeft = i % 2 === 0;
      const originX = isLeft ? width * 0.15 : width * 0.85;
      const originY = height * 0.7;
      const angle = isLeft 
        ? (-Math.PI / 4) + (Math.random() * 0.5 - 0.25)
        : (-3 * Math.PI / 4) + (Math.random() * 0.5 - 0.25);
      const speed = Math.random() * 16 + 10;

      this.particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed + (Math.random() * 4 - 2),
        vy: Math.sin(angle) * speed - (Math.random() * 6),
        w: Math.random() * 11 + 6,
        h: Math.random() * 7 + 4,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        oscillation: Math.random() * Math.PI,
        oscillationSpeed: Math.random() * 0.08 + 0.02,
        shape: Math.random() > 0.35 ? 'rect' : 'circle',
        opacity: 1,
        gravity: 0.36,
        friction: 0.985
      });
    }

    const startTime = performance.now();
    const render = (now) => {
      if (!this.isRunning) return;

      const elapsed = now - startTime;
      const progress = elapsed / durationMs;

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      let activeCount = 0;
      for (const p of this.particles) {
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.vy += p.gravity;
        p.x += p.vx + Math.sin(p.oscillation) * 1.5;
        p.y += p.vy;
        p.oscillation += p.oscillationSpeed;
        p.rotation += p.rotationSpeed;

        if (progress > 0.6) {
          p.opacity = Math.max(0, 1 - (progress - 0.6) / 0.4);
        }

        if (p.y < this.canvas.height + 50 && p.opacity > 0) {
          activeCount++;
          this.ctx.save();
          this.ctx.translate(p.x, p.y);
          this.ctx.rotate((p.rotation * Math.PI) / 180);
          this.ctx.globalAlpha = p.opacity;
          this.ctx.fillStyle = p.color;

          if (p.shape === 'rect') {
            this.ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          } else {
            this.ctx.beginPath();
            this.ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
            this.ctx.fill();
          }
          this.ctx.restore();
        }
      }

      if (elapsed < durationMs && activeCount > 0) {
        this.animId = requestAnimationFrame(render);
      } else {
        this.stop();
      }
    };

    this.animId = requestAnimationFrame(render);
  }

  stop() {
    this.isRunning = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    if (this.canvas) {
      this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.canvas.style.display = 'none';
    }
  }
}

// Cipta instance global
window.confetti = new ConfettiManager();
