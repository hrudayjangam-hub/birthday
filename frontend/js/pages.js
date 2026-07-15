const PageManager = {
  currentPage: null,
  pages: {},

  init() {
    document.querySelectorAll('.page').forEach(page => {
      this.pages[page.id] = page;
    });
  },

  show(pageId, animClass = 'fade-in') {
    const target = this.pages[pageId];
    if (!target) return;

    if (this.currentPage) {
      const prev = this.pages[this.currentPage];
      prev.classList.remove('active');
    }

    target.classList.add('active');
    target.querySelectorAll(`.${animClass.split(' ')[0]}`).forEach(el => {
      el.style.animation = 'none';
      void el.offsetHeight;
      el.style.animation = '';
    });

    this.currentPage = pageId;

    const animatedContent = target.querySelector('.fade-in, .fade-in-down, .fade-in-up, .fade-in-scale');
    if (animatedContent) {
      animatedContent.style.animation = 'none';
      void animatedContent.offsetHeight;
      animatedContent.style.animation = '';
    }
  },

  getPage(pageId) {
    return this.pages[pageId];
  }
};

const QuestionManager = {
  questions: [],
  currentIndex: 0,
  popupStage: 0,
  card: null,
  emojiEl: null,
  textEl: null,
  btnYes: null,
  btnNo: null,
  popupOverlay: null,
  popupEmoji: null,
  popupText: null,
  popupYes: null,
  popupNo: null,
  onYesCallback: null,

  noChainMessages: [
    {
      emoji: '\uD83E\uDD7A',
      text: "Really...? You might miss a little surprise.",
      yesLabel: '\u2764\uFE0F Let me see',
      noLabel: '\uD83E\uDD0D Not now'
    },
    {
      emoji: '\uD83C\uDF38',
      text: 'Maybe give it just one tiny chance?',
      yesLabel: '\uD83D\uDC4C Okay',
      noLabel: '\uD83E\uDD0D Still No'
    },
    {
      emoji: '\uD83D\uDC96',
      text: "No worries... I'll wait for you. \u2764\uFE0F",
      yesLabel: '\u2728 Try Again',
      noLabel: null
    }
  ],

  init() {
    this.card = document.getElementById('question-card');
    this.emojiEl = document.getElementById('question-emoji');
    this.textEl = document.getElementById('question-text');
    this.btnYes = document.getElementById('btn-yes');
    this.btnNo = document.getElementById('btn-no');
    this.popupOverlay = document.getElementById('popup-overlay');
    this.popupEmoji = document.getElementById('popup-emoji');
    this.popupText = document.getElementById('popup-text');
    this.popupYes = document.getElementById('popup-yes');
    this.popupNo = document.getElementById('popup-no');

    this.btnYes.addEventListener('click', () => this.handleYes());
    this.btnNo.addEventListener('click', () => this.handleNo());
    this.popupYes.addEventListener('click', () => this.handlePopupYes());
    this.popupNo.addEventListener('click', () => this.handlePopupNo());
  },

  setQuestions(questions, onYesCallback) {
    this.questions = questions;
    this.onYesCallback = onYesCallback;
  },

  showQuestion(index) {
    this.currentIndex = index;
    this.popupStage = 0;
    const q = this.questions[index];
    if (!q) return;

    this.emojiEl.textContent = q.emoji;
    this.textEl.textContent = q.text;

    const svgImg = document.querySelector('#question-page .svg-character');
    if (svgImg) {
      svgImg.src = index === 0
        ? 'assets/animations/question1-yes.svg'
        : 'assets/animations/question2-yes.svg';
    }

    this.card.style.animation = 'none';
    void this.card.offsetHeight;
    this.card.style.animation = 'cardFloatIn 0.6s ease forwards';

    this.popupOverlay.classList.remove('active');
  },

  handleYes() {
    Animations.confetti(30);
    Animations.heartBurst();
    const q = this.questions[this.currentIndex];
    if (q && q.onYes) {
      q.onYes();
    } else if (this.onYesCallback) {
      this.onYesCallback(this.currentIndex);
    }
  },

  handleNo() {
    this.showPopup(0);
  },

  showPopup(stage) {
    this.popupStage = stage;
    const msg = this.noChainMessages[stage];
    if (!msg) return;

    this.popupEmoji.textContent = msg.emoji;
    this.popupText.textContent = msg.text;

    this.popupYes.textContent = msg.yesLabel || '\u2728 Try Again';
    this.popupYes.style.display = 'inline-block';
    this.popupNo.style.display = msg.noLabel ? 'inline-block' : 'none';
    if (msg.noLabel) this.popupNo.textContent = msg.noLabel;

    this.popupOverlay.classList.add('active');
    this.popupCard.style.animation = 'none';
    void this.popupCard.offsetHeight;
    this.popupCard.style.animation = 'popupBounce 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
  },

  handlePopupYes() {
    if (this.popupStage === 2) {
      this.popupOverlay.classList.remove('active');
      this.showQuestion(this.currentIndex);
    } else {
      this.popupOverlay.classList.remove('active');
      Animations.confetti(20);
      Animations.heartBurst();
      if (this.onYesCallback) {
        this.onYesCallback(this.currentIndex);
      }
    }
  },

  handlePopupNo() {
    const nextStage = this.popupStage + 1;
    if (nextStage < this.noChainMessages.length) {
      this.showPopup(nextStage);
    } else {
      this.popupOverlay.classList.remove('active');
      this.showQuestion(this.currentIndex);
    }
  },

  reset() {
    this.popupOverlay.classList.remove('active');
    this.currentIndex = 0;
    this.popupStage = 0;
  }
};

const GalleryManager = {
  images: [],
  currentIndex: 0,
  modal: null,
  modalImage: null,
  modalCaption: null,
  modalClose: null,
  modalPrev: null,
  modalNext: null,

  init() {
    this.modal = document.getElementById('gallery-modal');
    this.modalImage = document.getElementById('modal-image');
    this.modalCaption = document.getElementById('modal-caption');
    this.modalClose = this.modal.querySelector('.modal-close');
    this.modalPrev = this.modal.querySelector('.modal-prev');
    this.modalNext = this.modal.querySelector('.modal-next');

    this.modalClose.addEventListener('click', () => this.close());
    this.modalPrev.addEventListener('click', () => this.prev());
    this.modalNext.addEventListener('click', () => this.next());
    this.modal.querySelector('.modal-overlay').addEventListener('click', () => this.close());

    document.addEventListener('keydown', (e) => {
      if (!this.modal.classList.contains('active')) return;
      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });

    document.querySelectorAll('.heart-image-wrapper').forEach(el => {
      el.addEventListener('click', () => this.open(parseInt(el.dataset.index)));
    });
  },

  load(data) {
    this.images = data;
    const wrappers = document.querySelectorAll('.heart-image-wrapper');
    wrappers.forEach((w, i) => {
      const img = w.querySelector('img');
      if (i < data.length && data[i]) {
        w.style.display = 'block';
        img.src = data[i].url;
        img.alt = data[i].caption || 'Memory';
      } else {
        w.style.display = 'none';
      }
    });
  },

  open(index) {
    this.currentIndex = index;
    this.updateModal();
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  close() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  },

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.updateModal();
  },

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updateModal();
  },

  updateModal() {
    const item = this.images[this.currentIndex];
    if (!item) return;
    this.modalImage.src = item.url;
    this.modalImage.alt = item.caption || 'Photo';
    this.modalCaption.textContent = item.caption || '';
  }
};

const PasscodeManager = {
  entered: '',
  maxDigits: 6,
  boxes: null,
  errorEl: null,

  init() {
    this.boxes = document.querySelectorAll('.pbox');
    this.errorEl = document.getElementById('passcode-error');
    document.querySelectorAll('.key').forEach(key => {
      key.addEventListener('click', () => this.handleKey(key.dataset.value));
    });
  },

  handleKey(value) {
    if (value === 'clear') {
      this.clear();
      return;
    }
    if (value === 'enter') {
      this.submit();
      return;
    }
    if (this.entered.length >= this.maxDigits) return;

    this.entered += value;
    this.updateBoxes();
    this.errorEl.textContent = '';

    if (this.entered.length === this.maxDigits) {
      setTimeout(() => this.submit(), 200);
    }
  },

  updateBoxes() {
    this.boxes.forEach((box, i) => {
      if (i < this.entered.length) {
        box.classList.add('filled');
        box.classList.remove('wrong');
        box.textContent = this.entered[i];
      } else {
        box.classList.remove('filled', 'wrong');
        box.textContent = '';
      }
    });
  },

  showError(msg) {
    this.errorEl.innerHTML = '\uD83E\uDD7A<br>' + msg;
    this.boxes.forEach(box => {
      box.classList.add('wrong');
      setTimeout(() => box.classList.remove('wrong'), 600);
    });
    this.clear();
  },

  clear() {
    this.entered = '';
    this.updateBoxes();
  },

  submit() {
    if (this.entered.length !== this.maxDigits) return;
    const code = this.entered;
    this.clear();
    if (typeof App !== 'undefined' && App.verifyPasscode) {
      App.verifyPasscode(code);
    }
  }
};

const LetterManager = {
  contentEl: null,
  titleEl: null,
  nextBtn: null,
  envelope: null,

  init() {
    this.contentEl = document.getElementById('letter-content');
    this.titleEl = document.getElementById('letter-title');
    this.nextBtn = document.getElementById('letter-next-btn');
    this.envelope = document.getElementById('envelope');
  },

  load(data) {
    if (data.title) this.titleEl.textContent = data.title;

    this.envelope.classList.remove('opened');
    document.getElementById('letter-paper-slide').style.display = 'none';
    this.nextBtn.style.display = 'none';

    this.envelope.onclick = () => {
      this.envelope.classList.add('opened');
      setTimeout(() => {
        document.getElementById('letter-paper-slide').style.display = 'block';
        document.getElementById('letter-paper-slide').style.animation = 'fadeInUp 0.6s ease';
        if (typeof Animations !== 'undefined' && Animations.typeText) {
          Animations.typeText(this.contentEl, data.content, () => {
            this.nextBtn.style.display = 'inline-block';
            this.nextBtn.style.animation = 'fadeIn 0.5s ease';
          });
        } else {
          this.contentEl.textContent = data.content;
          this.nextBtn.style.display = 'inline-block';
        }
      }, 600);
      this.envelope.onclick = null;
    };
  }
};
