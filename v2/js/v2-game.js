/**
 * PTAR Shelfcraft - Version 2 Game Application Controller
 * Handles LCC Stages, HUD Controls, Order Validation, Inspection Dialog, & Audio
 */

import { V2AudioEngine } from './v2-audio.js';
import { V2ShelfEngine } from './v2-engine.js';

class V2GameApp {
  constructor() {
    this.audio = new V2AudioEngine();
    this.engine = null;
    this.levels = (typeof window !== 'undefined' && window.LCC_LEVELS) || (typeof LCC_LEVELS !== 'undefined' ? LCC_LEVELS : []);
    this.currentLevelIndex = 0;
    this.levelStates = {};

    this.initLevelStates();
    this.initUI();
    this.initEngine();
    this.loadLevel(0);
  }

  initLevelStates() {
    this.levels.forEach(lvl => {
      // Susun mengikut initialSlot asal
      const initialBooks = [...lvl.books].sort((a, b) => a.initialSlot - b.initialSlot);
      this.levelStates[lvl.id] = {
        books: initialBooks,
        isSolved: false,
        statusText: null,
        showHint: false
      };
    });
  }

  initEngine() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    this.engine = new V2ShelfEngine(container, this.audio);

    // Sambungkan acara pertukaran buku dari enjin 3D
    this.engine.onBookSwapped = () => {
      this.handleOrderChanged();
    };

    // Sambungkan permintaan pemeriksaan buku 3D
    this.engine.onInspectRequested = (bookObj) => {
      this.openInspectionModal(bookObj);
    };
  }

  initUI() {
    // 1. Butang Bunyi Master
    const btnMute = document.getElementById('btn-sound-toggle');
    btnMute?.addEventListener('click', () => {
      const isMuted = this.audio.toggleMute();
      btnMute.classList.toggle('active', !isMuted);
      btnMute.querySelector('span').textContent = isMuted ? 'Muted' : 'Sound: ON';
    });

    // 2. Kawalan Permainan Bawah (RESET, HINT, CHECK ORDER, INSPECT)
    document.getElementById('btn-reset')?.addEventListener('click', () => {
      this.resetCurrentLevel();
    });

    document.getElementById('btn-hint')?.addEventListener('click', () => {
      this.toggleHint();
    });

    document.getElementById('btn-check')?.addEventListener('click', () => {
      this.checkOrder();
    });

    document.getElementById('btn-inspect-mode')?.addEventListener('click', () => {
      // Periksa buku pertama atau buku tengah secara lalai
      if (this.engine && this.engine.books.length > 0) {
        this.openInspectionModal(this.engine.books[2] || this.engine.books[0]);
      }
    });

    // Tutup Mod Pemeriksaan
    document.getElementById('btn-close-inspect')?.addEventListener('click', () => {
      this.closeInspectionModal();
    });

    // Tutup Modal Tahniah
    document.getElementById('btn-close-victory')?.addEventListener('click', () => {
      document.getElementById('victory-modal')?.classList.remove('show');
      if (window.confetti) window.confetti.stop();
    });

    this.renderStagePills();
  }

  renderStagePills() {
    const container = document.getElementById('stage-pills-container');
    if (!container) return;

    container.innerHTML = this.levels.map((lvl, idx) => {
      const state = this.levelStates[lvl.id];
      const isSolved = state && state.isSolved;
      const isActive = idx === this.currentLevelIndex;

      return `
        <button class="stage-pill ${isActive ? 'active' : ''} ${isSolved ? 'solved' : ''}"
                title="Tahap ${lvl.id}: ${lvl.title}"
                data-index="${idx}">
          ${lvl.id}${isSolved ? '✓' : ''}
        </button>
      `;
    }).join('');

    container.querySelectorAll('.stage-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-index'));
        this.loadLevel(idx);
      });
    });
  }

  loadLevel(index) {
    if (index < 0 || index >= this.levels.length) return;
    this.currentLevelIndex = index;

    const level = this.levels[index];
    const state = this.levelStates[level.id];

    // Kemas kini tajuk dan petua di HUD
    const tagElem = document.getElementById('level-tag');
    const titleElem = document.getElementById('level-title');
    const hintElem = document.getElementById('level-hint-box');
    const feedbackElem = document.getElementById('feedback-banner');

    if (tagElem) tagElem.textContent = `TAHAP ${level.id} DARI 10`;
    if (titleElem) titleElem.textContent = level.title;
    if (hintElem) {
      hintElem.innerHTML = `<strong>Petua:</strong> ${level.hint}`;
      hintElem.classList.toggle('show', state.showHint);
    }
    if (feedbackElem) {
      feedbackElem.className = 'feedback-banner';
      if (state.statusText === 'correct') {
        feedbackElem.className = 'feedback-banner correct';
        feedbackElem.innerHTML = '<span>✓ CORRECT! TAHNIAH, SUSUNAN BUKU ADALAH TEPAT!</span>';
      } else if (state.statusText === 'wrong') {
        feedbackElem.className = 'feedback-banner wrong';
        feedbackElem.innerHTML = '<span>✗ WRONG - SILA CUBA LAGI!</span>';
      }
    }

    // Muat buku ke dalam enjin 3D
    if (this.engine) {
      this.engine.loadLevelBooks(state.books);
    }

    this.renderStagePills();
  }

  handleOrderChanged() {
    // Kemas kini susunan buku dalam state berdasarkan kedudukan terkini di enjin 3D
    if (!this.engine) return;
    const currentLevel = this.levels[this.currentLevelIndex];
    const state = this.levelStates[currentLevel.id];

    state.books = this.engine.books.map(b => b.data);
    state.statusText = null;

    // Sembunyikan banner semakan
    const feedbackElem = document.getElementById('feedback-banner');
    if (feedbackElem) feedbackElem.className = 'feedback-banner';
  }

  resetCurrentLevel() {
    const currentLevel = this.levels[this.currentLevelIndex];
    const initialBooks = [...currentLevel.books].sort((a, b) => a.initialSlot - b.initialSlot);

    this.levelStates[currentLevel.id] = {
      books: initialBooks,
      isSolved: false,
      statusText: null,
      showHint: false
    };

    this.loadLevel(this.currentLevelIndex);
  }

  toggleHint() {
    const currentLevel = this.levels[this.currentLevelIndex];
    const state = this.levelStates[currentLevel.id];
    state.showHint = !state.showHint;

    const hintElem = document.getElementById('level-hint-box');
    if (hintElem) {
      hintElem.classList.toggle('show', state.showHint);
    }
  }

  checkOrder() {
    if (!this.engine) return;
    const currentLevel = this.levels[this.currentLevelIndex];
    const state = this.levelStates[currentLevel.id];

    // Semak sama ada targetSlot buku di indeks 0..4 sepadan dengan 1..5
    let isCorrect = true;
    for (let i = 0; i < this.engine.books.length; i++) {
      const bookData = this.engine.books[i].data;
      if (bookData.targetSlot !== (i + 1)) {
        isCorrect = false;
        break;
      }
    }

    const feedbackElem = document.getElementById('feedback-banner');

    if (isCorrect) {
      state.isSolved = true;
      state.statusText = 'correct';
      this.audio.playCorrect();

      if (feedbackElem) {
        feedbackElem.className = 'feedback-banner correct';
        feedbackElem.innerHTML = '<span>✓ CORRECT! TAHNIAH, SUSUNAN BUKU ADALAH TEPAT!</span>';
      }

      this.renderStagePills();
      this.checkAllCompleted();
    } else {
      state.isSolved = false;
      state.statusText = 'wrong';
      this.audio.playWrong();

      if (feedbackElem) {
        feedbackElem.className = 'feedback-banner wrong';
        feedbackElem.innerHTML = '<span>✗ WRONG - PERIKSA KOD SUBJEK ATAU NILAI CUTTER!</span>';
      }
    }
  }

  checkAllCompleted() {
    const allSolved = Object.values(this.levelStates).every(s => s.isSolved);
    if (allSolved) {
      setTimeout(() => {
        document.getElementById('victory-modal')?.classList.add('show');
        if (window.confetti) window.confetti.start();
        this.audio.playCorrect();
      }, 600);
    }
  }

  // Mod Pemeriksaan Buku 3D
  openInspectionModal(bookObj) {
    if (!bookObj || !this.engine) return;

    this.engine.inspectBook(bookObj);

    const modal = document.getElementById('inspect-modal');
    const bookData = bookObj.data;

    // Isi maklumat kad katalog MARC
    const callNumber = (bookData.lines || [bookData.callNumber]).join(' ');
    document.getElementById('card-call-num').textContent = callNumber;
    document.getElementById('card-title').textContent = `Buku Koleksi PTAR #${bookData.id}`;
    
    // Analisis anatomi LCC
    const lines = bookData.lines || [bookData.callNumber];
    document.getElementById('card-class-letter').textContent = lines[0] || '-';
    document.getElementById('card-class-num').textContent = lines[1] || '-';
    document.getElementById('card-cutter').textContent = lines[2] || '-';
    document.getElementById('card-suffix').textContent = lines.slice(3).join(' ') || '-';

    modal?.classList.add('show');
  }

  closeInspectionModal() {
    if (this.engine) {
      this.engine.closeInspection();
    }
    document.getElementById('inspect-modal')?.classList.remove('show');
  }
}

// Mulakan apabila DOM sedia
document.addEventListener('DOMContentLoaded', () => {
  window.v2Game = new V2GameApp();
});
