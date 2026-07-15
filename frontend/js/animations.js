const Animations = {
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
    const colors = [
      '#f8a5c2', '#d4a5f5', '#ffd6e0', '#ffb3c6',
      '#c8b6ff', '#ffd6a5', '#a0c4ff', '#fdffb6'
    ];
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
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const heart = document.createElement('div');
      heart.className = 'heart-rain-piece';
      heart.textContent = '\u2764';
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
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        if (callback) callback();
      }
    }
    requestAnimationFrame(update);
  },

  animateGiftBox() {
    const box = document.getElementById('gift-box');
    if (!box) return;
    box.classList.add('opened');
  }
};
