const Animations = {
  audioCtx: null,
  musicGain: null,
  musicPlaying: false,
  musicOscillators: [],

  ripple(e) {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  },

  getAudioCtx() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.musicGain = this.audioCtx.createGain();
      this.musicGain.gain.value = 0.08;
      this.musicGain.connect(this.audioCtx.destination);
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  },

  playChime(freq = 523.25, duration = 0.3, vol = 0.15) {
    try {
      const ctx = this.getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) { /* silent */ }
  },

  playHappySound() {
    this.playChime(523.25, 0.15, 0.12);
    setTimeout(() => this.playChime(659.25, 0.15, 0.12), 120);
    setTimeout(() => this.playChime(783.99, 0.3, 0.12), 240);
  },

  playLockSound() {
    try {
      const ctx = this.getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) { /* silent */ }
  },

  playUnlockSound() {
    try {
      const ctx = this.getAudioCtx();
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.1, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.3);
        }, i * 80);
      });
    } catch (e) { /* silent */ }
  },

  playEnvelopeSound() {
    try {
      const ctx = this.getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.value = 440;
        gain2.gain.setValueAtTime(0.06, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.15);
      }, 200);
    } catch (e) { /* silent */ }
  },

  playGiftSound() {
    try {
      const ctx = this.getAudioCtx();
      [440, 554.37, 659.25, 880, 1046.5].forEach((freq, i) => {
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = i % 2 === 0 ? 'sine' : 'triangle';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.1, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.4);
        }, i * 100);
      });
    } catch (e) { /* silent */ }
  },

  startMusic() {
    if (this.musicPlaying) return;
    this.musicPlaying = true;
    try {
      const ctx = this.getAudioCtx();
      const notes = [261.63, 329.63, 392, 523.25, 392, 329.63, 261.63, 329.63, 392, 523.25, 659.25, 523.25, 392, 329.63, 261.63, 293.66, 349.23, 440, 349.23, 293.66, 261.63, 293.66, 349.23, 440, 523.25, 440, 349.23, 293.66];
      let noteIndex = 0;

      function playNext() {
        if (!Animations.musicPlaying) return;
        const freq = notes[noteIndex % notes.length];
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
        osc.connect(gain);
        gain.connect(Animations.musicGain);
        osc.start();
        osc.stop(ctx.currentTime + 0.8);
        noteIndex++;
        Animations.musicOscillators.push({ osc, gain });
        setTimeout(playNext, 900);
      }
      playNext();
    } catch (e) { /* silent */ }
  },

  stopMusic() {
    this.musicPlaying = false;
    this.musicOscillators.forEach(o => {
      try { o.osc.stop(); } catch (e) { /* */ }
    });
    this.musicOscillators = [];
  },

  toggleMusic() {
    const btn = document.getElementById('music-toggle');
    if (this.musicPlaying) {
      this.stopMusic();
      if (btn) btn.textContent = '\u266A';
    } else {
      this.startMusic();
      if (btn) btn.textContent = '\u266B';
    }
  },

  typeText(element, text, callback) {
    element.textContent = '';
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    element.appendChild(cursor);

    let index = 0;
    const speed = 20;

    function type() {
      if (index < text.length) {
        cursor.parentNode.insertBefore(
          document.createTextNode(text[index]),
          cursor
        );
        index++;
        setTimeout(type, speed);
      } else {
        if (callback) callback();
      }
    }
    type();
  },

  confetti(count = 60) {
    const container = document.getElementById('confetti-container');
    if (!container) return;
    const colors = ['#f8a5c2', '#d4a5f5', '#ffd6e0', '#ffb3c6', '#c8b6ff', '#ffd6a5', '#a0c4ff', '#fdffb6'];
    const shapes = ['circle', 'square', 'triangle'];

    for (let i = 0; i < count; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = 6 + Math.random() * 8;
      const shape = shapes[Math.floor(Math.random() * shapes.length)];

      piece.style.width = `${size}px`;
      piece.style.height = `${size}px`;
      piece.style.background = color;
      piece.style.borderRadius = shape === 'circle' ? '50%' : shape === 'square' ? '2px' : '0';

      if (shape === 'triangle') {
        piece.style.width = '0';
        piece.style.height = '0';
        piece.style.background = 'none';
        piece.style.borderLeft = `${size / 2}px solid transparent`;
        piece.style.borderRight = `${size / 2}px solid transparent`;
        piece.style.borderBottom = `${size}px solid ${color}`;
      }

      piece.style.left = `${Math.random() * 100}%`;
      piece.style.top = `-${10 + Math.random() * 20}px`;
      piece.style.animationDuration = `${2 + Math.random() * 3}s`;
      piece.style.animationDelay = `${Math.random() * 1.5}s`;
      piece.style.transform = `rotate(${Math.random() * 360}deg)`;

      container.appendChild(piece);
      piece.addEventListener('animationend', () => piece.remove());
    }
  },

  heartRain(count = 40) {
    const container = document.getElementById('heart-rain-container');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const heart = document.createElement('div');
      heart.className = 'heart-rain-piece';
      heart.textContent = ['\u2764', '\uD83D\uDC9B', '\uD83D\uDC9C', '\uD83D\uDC9D'][Math.floor(Math.random() * 4)];
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.fontSize = `${14 + Math.random() * 18}px`;
      heart.style.animationDuration = `${4 + Math.random() * 4}s`;
      heart.style.animationDelay = `${Math.random() * 4}s`;
      heart.style.opacity = 0.3 + Math.random() * 0.4;
      const colors = ['#f8a5c2', '#e883ae', '#d4a5f5', '#ff6b9d', '#c084fc'];
      heart.style.color = colors[Math.floor(Math.random() * colors.length)];
      container.appendChild(heart);
    }
  },

  heartBurst(count = 12) {
    for (let i = 0; i < count; i++) {
      const heart = document.createElement('div');
      heart.className = 'heart-burst-piece';
      heart.textContent = '\u2764';
      heart.style.left = '50%';
      heart.style.top = '50%';
      heart.style.fontSize = `${14 + Math.random() * 12}px`;
      const angle = (Math.PI * 2 * i) / count;
      const dist = 80 + Math.random() * 100;
      heart.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
      heart.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
      heart.style.animationDuration = `${0.6 + Math.random() * 0.4}s`;
      const colors = ['#f8a5c2', '#ff6b9d', '#d4a5f5', '#ff8fab', '#e883ae'];
      heart.style.color = colors[Math.floor(Math.random() * colors.length)];
      document.body.appendChild(heart);
      heart.addEventListener('animationend', () => heart.remove());
    }
  },

  spawnButterflies(count = 3) {
    const container = document.getElementById('butterfly-container');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const b = document.createElement('div');
      b.className = 'butterfly';
      b.textContent = '\uD83E\uDD8B';
      b.style.left = `${10 + Math.random() * 80}%`;
      b.style.top = `${10 + Math.random() * 70}%`;
      b.style.fontSize = `${18 + Math.random() * 12}px`;
      b.style.animationDuration = `${8 + Math.random() * 6}s`;
      b.style.animationDelay = `${i * 2}s`;
      b.style.opacity = 0.5 + Math.random() * 0.4;
      container.appendChild(b);
    }
  },

  initRippleButtons() {
    document.querySelectorAll('.ripple').forEach(btn => {
      btn.addEventListener('click', this.ripple);
    });
  },

  animateLoadingBar(duration, callback) {
    const fill = document.querySelector('.loading-fill');
    if (!fill) { if (callback) callback(); return; }
    fill.style.width = '0%';
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      fill.style.width = `${eased * 100}%`;
      if (progress < 1) requestAnimationFrame(update);
      else if (callback) callback();
    }
    requestAnimationFrame(update);
  },

  animateGiftBox() {
    const box = document.getElementById('gift-box');
    if (!box) return;
    box.classList.add('opened');
  },

  initSparkleTrail() {
    let last = 0;
    const container = document.getElementById('sparkle-container') || (() => {
      const el = document.createElement('div');
      el.id = 'sparkle-container';
      document.body.appendChild(el);
      return el;
    })();

    const addSparkle = (x, y) => {
      const s = document.createElement('div');
      s.className = 'sparkle-trail-piece';
      s.textContent = '\u2728';
      s.style.left = `${x}px`;
      s.style.top = `${y}px`;
      s.style.fontSize = `${8 + Math.random() * 8}px`;
      s.style.animationDuration = `${0.6 + Math.random() * 0.4}s`;
      container.appendChild(s);
      s.addEventListener('animationend', () => s.remove());
    };

    const handler = (e) => {
      const now = Date.now();
      if (now - last < 50) return;
      last = now;
      const touch = e.touches ? e.touches[0] : e;
      if (!touch) return;
      addSparkle(touch.clientX - 6, touch.clientY - 6);
    };

    document.addEventListener('mousemove', handler);
    document.addEventListener('touchmove', handler, { passive: true });
  },

  transitionPage(fromPage, toPage, type) {
    const fromEl = document.getElementById(fromPage);
    const toEl = document.getElementById(toPage);
    if (!fromEl || !toEl) return;

    const types = {
      slideLeft: { from: 'slideOutLeft', to: 'slideInRight' },
      slideRight: { from: 'slideOutRight', to: 'slideInLeft' },
      fade: { from: 'fadeOut', to: 'fadeIn' },
      zoom: { from: 'zoomOut', to: 'zoomIn' },
      heart: { from: 'heartShrink', to: 'heartGrow' }
    };

    const anim = types[type] || types.fade;

    fromEl.classList.remove('active');
    fromEl.style.animation = `${anim.from} 0.5s ease forwards`;
    toEl.style.animation = `${anim.to} 0.5s ease forwards`;
    toEl.classList.add('active');

    setTimeout(() => {
      fromEl.style.animation = '';
      toEl.style.animation = '';
    }, 600);
  }
};
