/**
 * Módulo Completo de Accesibilidad (WCAG 2.1 AA)
 * Incluye: Lector de Voz (TTS), Daltonismo/Filtros, Tamaño de Letra, Interlineado, Resaltado de Enlaces y Restablecimiento.
 */
import { getLang } from './i18n.js';

let synth = window.speechSynthesis;
let utterance = null;
let isSpeaking = false;
let currentFontSizeStep = 0; // -1: 90%, 0: 100%, 1: 115%, 2: 130%
const fontScaleClasses = ['font-scale-sm', 'font-scale-md', 'font-scale-lg', 'font-scale-xl'];

export function initAccessibility() {
  initTTS();
  initColorFilters();
  initFontScaling();
  initReadingSpacing();
  initLinkHighlight();
  initAnimationsToggle();
  initResetButton();
}

/**
 * 1. LECTOR DE VOZ (Text-to-Speech con Web Speech API)
 */
function initTTS() {
  const btnPlay = document.getElementById('tts-play');
  const btnPause = document.getElementById('tts-pause');
  const btnStop = document.getElementById('tts-stop');

  if (!btnPlay || !btnStop) return;

  btnPlay.addEventListener('click', () => {
    if (synth && synth.paused) {
      synth.resume();
      isSpeaking = true;
      updateTTSButtons(true);
      return;
    }

    if (synth && synth.speaking) {
      synth.cancel();
    }

    // Extraer texto relevante del documento principal
    const mainElement = document.querySelector('main') || document.body;
    const textToRead = mainElement.innerText.replace(/\s+/g, ' ').trim();

    if (!textToRead) return;

    utterance = new SpeechSynthesisUtterance(textToRead);
    const lang = getLang();
    utterance.lang = lang === 'es' ? 'es-ES' : 'en-US';
    utterance.rate = 0.95; // Velocidad cómoda de lectura

    utterance.onstart = () => {
      isSpeaking = true;
      updateTTSButtons(true);
    };

    utterance.onend = () => {
      isSpeaking = false;
      updateTTSButtons(false);
    };

    utterance.onerror = (e) => {
      console.warn('Error en lectura de voz:', e);
      isSpeaking = false;
      updateTTSButtons(false);
    };

    synth.speak(utterance);
  });

  if (btnPause) {
    btnPause.addEventListener('click', () => {
      if (synth && synth.speaking && !synth.paused) {
        synth.pause();
        updateTTSButtons('paused');
      }
    });
  }

  btnStop.addEventListener('click', () => {
    if (synth) {
      synth.cancel();
      isSpeaking = false;
      updateTTSButtons(false);
    }
  });
}

function updateTTSButtons(state) {
  const btnPlay = document.getElementById('tts-play');
  const btnPause = document.getElementById('tts-pause');
  const btnStop = document.getElementById('tts-stop');

  if (state === true) {
    if (btnPlay) btnPlay.classList.add('active');
    if (btnPause) btnPause.classList.remove('active');
  } else if (state === 'paused') {
    if (btnPlay) btnPlay.classList.remove('active');
    if (btnPause) btnPause.classList.add('active');
  } else {
    if (btnPlay) btnPlay.classList.remove('active');
    if (btnPause) btnPause.classList.remove('active');
  }
}

/**
 * 2. FILTROS DE COLOR (Monocromático/Daltonismo, Alto Contraste, Invertir)
 */
function initColorFilters() {
  const filterSelect = document.getElementById('accessibility-filter');
  if (!filterSelect) return;

  filterSelect.addEventListener('change', (e) => {
    applyFilter(e.target.value);
  });

  // Restaurar de localStorage si existe
  const savedFilter = localStorage.getItem('access_filter') || 'normal';
  filterSelect.value = savedFilter;
  applyFilter(savedFilter);
}

function applyFilter(filterType) {
  document.body.classList.remove('filter-monochrome', 'filter-contrast', 'filter-invert');

  if (filterType === 'monochrome') {
    document.body.classList.add('filter-monochrome');
  } else if (filterType === 'contrast') {
    document.body.classList.add('filter-contrast');
  } else if (filterType === 'invert') {
    document.body.classList.add('filter-invert');
  }

  localStorage.setItem('access_filter', filterType);
}

/**
 * 3. CONTROL DE TAMAÑO DE TEXTO (A-, A, A+)
 */
function initFontScaling() {
  const btnDec = document.getElementById('font-decrease');
  const btnReset = document.getElementById('font-reset');
  const btnInc = document.getElementById('font-increase');

  if (!btnDec || !btnInc) return;

  const savedScale = parseInt(localStorage.getItem('access_font_scale') || '0', 10);
  setFontScale(savedScale);

  btnDec.addEventListener('click', () => setFontScale(currentFontSizeStep - 1));
  if (btnReset) btnReset.addEventListener('click', () => setFontScale(0));
  btnInc.addEventListener('click', () => setFontScale(currentFontSizeStep + 1));
}

function setFontScale(step) {
  if (step < -1) step = -1;
  if (step > 2) step = 2;

  currentFontSizeStep = step;

  fontScaleClasses.forEach(cls => document.documentElement.classList.remove(cls));

  if (step === -1) document.documentElement.classList.add('font-scale-sm');
  else if (step === 1) document.documentElement.classList.add('font-scale-lg');
  else if (step === 2) document.documentElement.classList.add('font-scale-xl');

  localStorage.setItem('access_font_scale', step.toString());
}

/**
 * 4. ESPACIADO DE LECTURA (DISLEXIA / LEGIBILIDAD)
 */
function initReadingSpacing() {
  const spacingBtn = document.getElementById('toggle-spacing');
  if (!spacingBtn) return;

  const savedSpacing = localStorage.getItem('access_spacing') === 'true';
  if (savedSpacing) {
    document.body.classList.add('reading-spacing-expanded');
    spacingBtn.setAttribute('aria-pressed', 'true');
  }

  spacingBtn.addEventListener('click', () => {
    const isExpanded = document.body.classList.toggle('reading-spacing-expanded');
    spacingBtn.setAttribute('aria-pressed', isExpanded ? 'true' : 'false');
    localStorage.setItem('access_spacing', isExpanded);
  });
}

/**
 * 5. RESALTAR ENLACES E INTERACTIVOS
 */
function initLinkHighlight() {
  const highlightBtn = document.getElementById('toggle-highlight-links');
  if (!highlightBtn) return;

  const savedHighlight = localStorage.getItem('access_highlight_links') === 'true';
  if (savedHighlight) {
    document.body.classList.add('highlight-interactive-links');
    highlightBtn.setAttribute('aria-pressed', 'true');
  }

  highlightBtn.addEventListener('click', () => {
    const isHighlighted = document.body.classList.toggle('highlight-interactive-links');
    highlightBtn.setAttribute('aria-pressed', isHighlighted ? 'true' : 'false');
    localStorage.setItem('access_highlight_links', isHighlighted);
  });
}

/**
 * 6. PAUSAR / DESACTIVAR ANIMACIONES Y MOVIMIENTO (TDA / CONCENTRACIÓN / WCAG)
 */
function initAnimationsToggle() {
  const animationsBtn = document.getElementById('toggle-animations');
  if (!animationsBtn) return;

  const savedPause = localStorage.getItem('access_pause_animations') === 'true';
  if (savedPause) {
    document.body.classList.add('disable-animations');
    animationsBtn.setAttribute('aria-pressed', 'true');
    animationsBtn.classList.add('active');
    document.querySelectorAll('video').forEach(v => v.pause());
  }

  animationsBtn.addEventListener('click', () => {
    const isPaused = document.body.classList.toggle('disable-animations');
    animationsBtn.setAttribute('aria-pressed', isPaused ? 'true' : 'false');
    if (isPaused) {
      animationsBtn.classList.add('active');
      document.querySelectorAll('video').forEach(v => v.pause());
    } else {
      animationsBtn.classList.remove('active');
      document.querySelectorAll('video').forEach(v => v.play().catch(() => {}));
    }
    localStorage.setItem('access_pause_animations', isPaused);
  });
}

/**
 * 7. RESTABLECER AJUSTES DE ACCESIBILIDAD
 */
function initResetButton() {
  const btnResetAll = document.getElementById('accessibility-reset-all');
  if (!btnResetAll) return;

  btnResetAll.addEventListener('click', () => {
    // Detener voz
    if (synth) synth.cancel();
    updateTTSButtons(false);

    // Filtros
    applyFilter('normal');
    const filterSelect = document.getElementById('accessibility-filter');
    if (filterSelect) filterSelect.value = 'normal';

    // Tamaño de fuente
    setFontScale(0);

    // Espaciado
    document.body.classList.remove('reading-spacing-expanded');
    const spacingBtn = document.getElementById('toggle-spacing');
    if (spacingBtn) spacingBtn.setAttribute('aria-pressed', 'false');

    // Resaltado de enlaces
    document.body.classList.remove('highlight-interactive-links');
    const highlightBtn = document.getElementById('toggle-highlight-links');
    if (highlightBtn) highlightBtn.setAttribute('aria-pressed', 'false');

    // Desactivar pausa de animaciones
    document.body.classList.remove('disable-animations');
    const animationsBtn = document.getElementById('toggle-animations');
    if (animationsBtn) {
      animationsBtn.setAttribute('aria-pressed', 'false');
      animationsBtn.classList.remove('active');
    }

    // Limpiar localStorage de accesibilidad
    localStorage.removeItem('access_filter');
    localStorage.removeItem('access_font_scale');
    localStorage.removeItem('access_spacing');
    localStorage.removeItem('access_highlight_links');
    localStorage.removeItem('access_pause_animations');
  });
}
