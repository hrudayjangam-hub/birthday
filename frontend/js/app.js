const API_BASE = window.location.origin + '/api';

const App = {
  currentState: 'loading',

  async init() {
    PageManager.init();
    QuestionManager.init();
    GalleryManager.init();
    PasscodeManager.init();
    LetterManager.init();
    Animations.initRippleButtons();

    this.setupQuestions();
    this.bindEvents();

    Animations.spawnButterflies(4);
    this.setupMusicToggle();
    Animations.initSparkleTrail();
    Animations.startTwinklingStars(16);
    Animations.startRosePetals(4000);
    Animations.orbitHearts(5);

    this.autoStartBGM();
    await this.showLoading();
  },

  setupMusicToggle() {
    const btn = document.getElementById('music-toggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      Animations.toggleMusic();
      if (Animations.musicPlaying) {
        btn.classList.add('playing');
      } else {
        btn.classList.remove('playing');
      }
    });
  },

  autoStartBGM() {
    const btn = document.getElementById('music-toggle');
    Animations.initBGM();
    Animations.startMusic();
    if (btn) { btn.classList.add('playing'); btn.textContent = '\u266B'; }

    const tryPlay = () => {
      if (!Animations.musicPlaying && Animations.bgmAudio) {
        Animations.startMusic();
        if (btn) btn.classList.add('playing');
      }
    };

    document.addEventListener('touchstart', tryPlay, { once: true });
    document.addEventListener('click', tryPlay, { once: true });
    document.addEventListener('keydown', tryPlay, { once: true });
  },

  setupQuestions() {
    const qData = [
      {
        emoji: '\uD83D\uDC9D',
        text: 'I have a surprise for you...\nWould you like to see it? \u2764\uFE0F',
      },
      {
        emoji: '\u2728',
        text: 'Are you ready to continue this little surprise? \uD83D\uDC95',
      }
    ];

    QuestionManager.setQuestions(qData, (index) => {
      this.onQuestionYes(index);
    });
  },

  onQuestionYes(index) {
    if (index === 0) {
      setTimeout(() => this.goToQuestion(1), 600);
    } else if (index === 1) {
      setTimeout(() => this.goToPasscode(), 600);
    }
  },

  bindEvents() {
    document.getElementById('start-btn').addEventListener('click', () => {
      Animations.playHappySound();
      this.goToQuestion(0);
    });

    document.getElementById('gallery-next-btn').addEventListener('click', () => {
      this.goToLetter();
    });

    document.getElementById('letter-next-btn').addEventListener('click', () => {
      this.goToSurprise();
    });

    document.getElementById('restart-btn').addEventListener('click', () => {
      this.restart();
    });
  },

  async showLoading() {
    PageManager.show('loading-screen');
    Animations.animateLoadingBar(2500, () => {
      setTimeout(() => {
        PageManager.show('welcome-screen', 'fade-in-down');
        this.currentState = 'welcome';
      }, 300);
    });
  },

  goToQuestion(index) {
    QuestionManager.showQuestion(index);
    PageManager.show('question-page', 'fade-in-scale', 'slideLeft');
    this.currentState = 'question';
  },

  goToPasscode() {
    PasscodeManager.clear();
    PageManager.show('passcode-screen', 'fade-in-scale', 'slideLeft');
    this.currentState = 'passcode';
  },

  async verifyPasscode(code) {
    try {
      const res = await fetch(`${API_BASE}/users/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: code })
      });
      const data = await res.json();
      if (data.success) {
        this.onPasscodeSuccess();
      } else {
        PasscodeManager.showError("That's not the correct password.");
      }
    } catch (err) {
      PasscodeManager.showError('Connection error. Please try again.');
    }
  },

  onPasscodeSuccess() {
    Animations.playUnlockSound();
    const page = PageManager.getPage('passcode-screen');
    const container = page.querySelector('.passcode-container');
    Animations.confetti(60);
    Animations.heartBurst();
    container.style.animation = 'fadeInScale 0.5s ease reverse forwards';
    setTimeout(() => {
      this.goToGallery();
    }, 500);
  },

  async goToGallery() {
    PageManager.show('gallery-page', 'fade-in-down', 'heart');
    this.currentState = 'gallery';

    try {
      const res = await fetch(`${API_BASE}/gallery`);
      const json = await res.json();
      if (json.success && json.data) {
        const mapped = json.data.map(item => ({
          url: item.imageUrl,
          caption: item.caption || '\u2764\uFE0F'
        }));
        GalleryManager.load(mapped);
      } else {
        GalleryManager.load([]);
      }
    } catch (err) {
      GalleryManager.load([]);
    }

    setTimeout(() => this.showGalleryNextBtn(), 1200);
  },

  showGalleryNextBtn() {
    const btn = document.getElementById('gallery-next-btn');
    if (btn) {
      btn.style.display = 'block';
      btn.style.margin = '20px auto';
      btn.style.animation = 'fadeInUp 0.5s ease';
    }
  },

  async goToLetter() {
    PageManager.show('letter-page', 'fade-in-scale', 'slideLeft');
    this.currentState = 'letter';

    try {
      const res = await fetch(`${API_BASE}/letters`);
      const json = await res.json();
      if (json.success && json.data) {
        LetterManager.load({
          title: json.data.title || 'A Letter For You \u2764\uFE0F',
          content: json.data.content
        });
      } else {
        LetterManager.load({
          title: 'A Letter For You \u2764\uFE0F',
          content: 'From the moment you came into my life...'
        });
      }
    } catch (err) {
      LetterManager.load({
        title: 'A Letter For You \u2764\uFE0F',
        content: 'From the moment you came into my life...'
      });
    }
  },

  goToSurprise() {
    PageManager.show('surprise-page', 'fade-in-scale', 'slideLeft');
    this.currentState = 'surprise';
    this.setupGiftBox();
  },

  setupGiftBox() {
    const giftBox = document.getElementById('gift-box');
    const reveal = document.getElementById('surprise-reveal');

    const handleClick = () => {
      Animations.playGiftSound();
      Animations.animateGiftBox();
      Animations.confetti(120);
      Animations.heartBurst();
      Animations.fireworks(4);

      setTimeout(() => {
        reveal.style.display = 'block';
        reveal.style.animation = 'fadeInUp 0.8s ease';
      }, 800);

      setTimeout(() => {
        this.goToFinal();
      }, 5500);

      giftBox.removeEventListener('click', handleClick);
      giftBox.style.cursor = 'default';
    };

    giftBox.addEventListener('click', handleClick);
  },

  goToFinal() {
    PageManager.show('final-page', 'fade-in-down', 'heart');
    this.currentState = 'final';
    Animations.heartRain(50);
    Animations.confetti(40);
    Animations.fireworks(5);
    Animations.rosePetals(8);
  },

  restart() {
    document.getElementById('heart-rain-container').innerHTML = '';
    document.getElementById('confetti-container').innerHTML = '';
    const reveal = document.getElementById('surprise-reveal');
    reveal.style.display = 'none';
    const giftBox = document.getElementById('gift-box');
    giftBox.classList.remove('opened');
    giftBox.style.cursor = 'pointer';
    document.getElementById('letter-next-btn').style.display = 'none';

    const envelope = document.getElementById('envelope');
    envelope.classList.remove('opened');
    envelope.onclick = null;
    document.getElementById('letter-paper-slide').style.display = 'none';

    QuestionManager.reset();
    PageManager.show('welcome-screen', 'fade-in-down', 'slideLeft');
    this.currentState = 'welcome';
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
