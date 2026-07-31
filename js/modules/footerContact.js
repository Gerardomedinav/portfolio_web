/**
 * Módulo de Renderizado Dinámico de Información de Contacto y Pie de Página Interactivo
 */
import { getLang } from './i18n.js';
import { getContactData } from './dataStore.js';
import { openAccessibilityPanel } from './navigation.js';

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

export function initFooterChips() {
  const chips = document.querySelectorAll('.footer-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const action = chip.dataset.footerAction;
      if (action === 'projects') {
        const sec = document.querySelector('#projects');
        if (sec) sec.scrollIntoView({ behavior: 'smooth' });
      } else if (action === 'about') {
        const sec = document.querySelector('#about');
        if (sec) sec.scrollIntoView({ behavior: 'smooth' });
      } else if (action === 'skills') {
        const sec = document.querySelector('#skills');
        if (sec) sec.scrollIntoView({ behavior: 'smooth' });
      } else if (action === 'contact') {
        const sec = document.querySelector('#contact');
        if (sec) sec.scrollIntoView({ behavior: 'smooth' });
      } else if (action === 'bot') {
        const botBtn = document.getElementById('gerassist-toggle-btn');
        if (botBtn) botBtn.click();
      } else if (action === 'accessibility') {
        setTimeout(() => {
          openAccessibilityPanel();
        }, 60);
      }
    });
  });
}

export function initFooterContact() {
  renderFooterContact();
  initFooterChips();

  document.addEventListener('languageChange', () => renderFooterContact());
  document.addEventListener('contactDataChange', () => renderFooterContact());
}
