/**
 * Módulo de Renderizado Dinámico de la Sección Sobre Mí (About)
 */
import { getLang } from './i18n.js';
import { getAboutData } from './dataStore.js';

export function renderAbout() {
  const lang = getLang();
  const aboutData = getAboutData();

  // 1. Subtítulo de Sobre Mí
  const subtitleEl = document.querySelector('.about__subtitle');
  if (subtitleEl && aboutData.subtitle) {
    subtitleEl.textContent = aboutData.subtitle[lang] || aboutData.subtitle.es;
  }

  // 2. Texto Principal / Biografía de Sobre Mí
  const textEl = document.querySelector('.about__text');
  if (textEl && aboutData.text) {
    textEl.textContent = aboutData.text[lang] || aboutData.text.es;
  }

  // 3. Foto / Imagen Secundaria de Sobre Mí y Texto Alternativo (Alt Text)
  const fallbackImgEl = document.querySelector('.about-video img');
  if (fallbackImgEl) {
    if (aboutData.photoImg) fallbackImgEl.src = aboutData.photoImg;
    if (aboutData.photoImgAlt) {
      fallbackImgEl.alt = aboutData.photoImgAlt[lang] || aboutData.photoImgAlt.es;
    }
  }
}

export function initAbout() {
  renderAbout();

  document.addEventListener('languageChange', () => renderAbout());
  document.addEventListener('aboutDataChange', () => renderAbout());
}
