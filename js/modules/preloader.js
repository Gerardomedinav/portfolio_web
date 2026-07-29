/**
 * Módulo del Preloader de Carga Inteligente (SVG Circle Progress & Module Readiness)
 */

let preloaderEl = null;
let circleEl = null;
let percentTextEl = null;
let statusLabelEl = null;

const CIRCLE_RADIUS = 54;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS; // ~339.29

export function initPreloader() {
  if (document.getElementById('app-preloader')) return;

  preloaderEl = document.createElement('div');
  preloaderEl.id = 'app-preloader';
  preloaderEl.className = 'app-preloader';

  preloaderEl.innerHTML = `
    <div class="preloader-card">
      <div class="preloader-ring-wrapper">
        <svg class="preloader-svg" width="130" height="130" viewBox="0 0 120 120">
          <circle class="preloader-circle-bg" cx="60" cy="60" r="${CIRCLE_RADIUS}" />
          <circle class="preloader-circle-progress" cx="60" cy="60" r="${CIRCLE_RADIUS}" />
        </svg>
        <div class="preloader-percent-box">
          <span id="preloader-percent" class="preloader-percent-num">0%</span>
        </div>
      </div>

      <div class="preloader-info">
        <h3 class="preloader-title">Gerardo Medina</h3>
        <p id="preloader-status" class="preloader-status-text">⚡ Iniciando componentes...</p>
      </div>

      <div class="preloader-dots">
        <span></span><span></span><span></span>
      </div>
    </div>
  `;

  document.body.prepend(preloaderEl);

  circleEl = preloaderEl.querySelector('.preloader-circle-progress');
  percentTextEl = preloaderEl.querySelector('#preloader-percent');
  statusLabelEl = preloaderEl.querySelector('#preloader-status');

  if (circleEl) {
    circleEl.style.strokeDasharray = `${CIRCLE_CIRCUMFERENCE}`;
    circleEl.style.strokeDashoffset = `${CIRCLE_CIRCUMFERENCE}`;
  }
}

/**
 * Actualiza el porcentaje del preloader (0 a 100) y su texto descriptivo
 */
export function updatePreloaderProgress(percent, label) {
  if (!preloaderEl) initPreloader();

  const clamped = Math.min(100, Math.max(0, percent));

  if (circleEl) {
    const offset = CIRCLE_CIRCUMFERENCE - (clamped / 100) * CIRCLE_CIRCUMFERENCE;
    circleEl.style.strokeDashoffset = offset;
  }

  if (percentTextEl) {
    percentTextEl.textContent = `${Math.round(clamped)}%`;
  }

  if (statusLabelEl && label) {
    statusLabelEl.textContent = label;
  }

  if (clamped >= 100) {
    setTimeout(() => {
      finishPreloader();
    }, 400);
  }
}

/**
 * Finalización con animación de desvanecimiento elegante
 */
export function finishPreloader() {
  if (!preloaderEl) return;
  preloaderEl.classList.add('preloader-finish');
  setTimeout(() => {
    if (preloaderEl && preloaderEl.parentNode) {
      preloaderEl.parentNode.removeChild(preloaderEl);
    }
  }, 600);
}
