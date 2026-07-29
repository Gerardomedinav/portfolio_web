/**
 * Módulo de Renderizado Dinámico de Información de Contacto y Pie de Página
 */
import { getLang } from './i18n.js';
import { getContactData } from './dataStore.js';

export function renderFooterContact() {
  const lang = getLang();
  const contactData = getContactData();

  // 1. Teléfono / WhatsApp
  const phoneEl = document.querySelector('.contact__info-value--phone');
  if (phoneEl && contactData.phone) {
    phoneEl.textContent = contactData.phone;
    phoneEl.href = `tel:${contactData.phone.replace(/[^+\d]/g, '')}`;
  }

  // 2. Ubicación
  const locationEl = document.querySelector('.contact__info-item:nth-child(3) .contact__info-value');
  if (locationEl && contactData.location) {
    locationEl.textContent = contactData.location[lang] || contactData.location.es;
  }

  // 3. Footer Copyright
  const copyrightEl = document.querySelector('.footer__copyright p');
  if (copyrightEl && contactData.footerCopyright) {
    const copyText = contactData.footerCopyright[lang] || contactData.footerCopyright.es;
    copyrightEl.innerHTML = copyText;
  }
}

export function initFooterContact() {
  renderFooterContact();

  document.addEventListener('languageChange', () => renderFooterContact());
  document.addEventListener('contactDataChange', () => renderFooterContact());
}
