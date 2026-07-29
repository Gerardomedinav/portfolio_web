/**
 * Módulo de Renderizado Dinámico de la Sección Banner / Inicio
 */
import { getLang } from './i18n.js';
import { getBannerData } from './dataStore.js';

export function renderHome() {
  const lang = getLang();
  const bannerData = getBannerData();

  // 1. Título principal
  const homeTitleEl = document.querySelector('.home__title');
  if (homeTitleEl) {
    const greeting = (bannerData.greeting && bannerData.greeting[lang]) || (lang === 'es' ? 'Hola,' : 'Hi,');
    const name = (bannerData.name && bannerData.name[lang]) || 'Gerardo';
    const role = (bannerData.role && bannerData.role[lang]) || 'Full Stack Developer Jr.';

    homeTitleEl.innerHTML = `${greeting} <br /> ${lang === 'es' ? 'Soy' : "I'm"} <span class="home__title-color">${name}</span><br /> ${role}`;
  }

  // 2. Imagen de Perfil y Texto Alternativo (Alt Text)
  const profileImgEl = document.querySelector('.home__img-perfil');
  if (profileImgEl) {
    if (bannerData.profileImg) profileImgEl.src = bannerData.profileImg;
    if (bannerData.profileImgAlt) {
      profileImgEl.alt = bannerData.profileImgAlt[lang] || bannerData.profileImgAlt.es;
    }
  }

  // 3. Enlace del Currículum Vitae (PDF)
  const cvBtn = document.querySelector('.home__data .button[data-i18n="resume"]');
  if (cvBtn && bannerData.cv) {
    cvBtn.href = bannerData.cv[lang] || bannerData.cv.es;
  }

  // 4. Redes Sociales
  const socialIcons = document.querySelectorAll('.home__social-icon');
  if (socialIcons && socialIcons.length >= 3 && bannerData.social) {
    if (socialIcons[0] && bannerData.social.linkedin) socialIcons[0].href = bannerData.social.linkedin;
    if (socialIcons[1] && bannerData.social.github) socialIcons[1].href = bannerData.social.github;
    if (socialIcons[2] && bannerData.social.email) socialIcons[2].href = bannerData.social.email;
  }
}

export function initHome() {
  renderHome();

  document.addEventListener('languageChange', () => renderHome());
  document.addEventListener('bannerDataChange', () => renderHome());
}
