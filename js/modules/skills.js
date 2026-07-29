/**
 * Módulo de Carga y Renderizado Dinámico de Habilidades (Skills)
 */
import { getLang } from './i18n.js';

let skillCounter = 0;

const meteorDirections = [
  'meteor-top-left',
  'meteor-top-right',
  'meteor-bottom-left',
  'meteor-bottom-right',
  'meteor-top',
  'meteor-bottom'
];

export function loadSkills() {
  const lang = getLang();
  skillCounter = 0;

  fetch('./assets/json/skill.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error al cargar skill.json: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      renderSkillsCategory(data.languages, 'skills-languages', lang);
      renderSkillsCategory(data.frameworks, 'skills-frameworks', lang);
      renderSkillsCategory(data.tools, 'skills-tools', lang);

      if (typeof window !== 'undefined' && window.AOS) {
        window.AOS.refresh();
      }
    })
    .catch(error => console.error('Error cargando habilidades:', error));
}

export function renderSkillsCategory(skillsArray, containerId, lang) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = ''; // Limpiar previo

  skillsArray.forEach(skill => {
    const link = document.createElement('a');
    link.href = skill.link;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className = 'skills__name';
    link.setAttribute('role', 'listitem');

    const direction = meteorDirections[skillCounter % meteorDirections.length];
    const delay = (skillCounter % 8) * 110;
    skillCounter++;

    link.setAttribute('data-aos', direction);
    link.style.setProperty('--meteor-delay', `${delay}ms`);

    const altText = lang === 'es'
      ? `Logo de ${skill.name}, herramienta o tecnología utilizada por Gerardo Medina`
      : `Logo of ${skill.name}, tool or technology used by Gerardo Medina`;

    const img = document.createElement('img');
    img.src = skill.image;
    img.alt = altText;

    link.setAttribute('aria-label', altText);

    // Disparar la onda de choque ÚNICAMENTE al ingresar el puntero (mouseenter)
    link.addEventListener('mouseenter', () => {
      if (document.body.classList.contains('disable-animations')) return;
      link.classList.remove('is-hover-impact');
      void link.offsetWidth; // Forzar reflow para re-iniciar la animación limpiamente
      link.classList.add('is-hover-impact');
    });

    link.addEventListener('animationend', (e) => {
      if (e.animationName === 'shockwaveHover') {
        link.classList.remove('is-hover-impact');
      }
    });

    link.appendChild(img);
    link.appendChild(document.createTextNode(` ${skill.name}`));
    container.appendChild(link);
  });
}

export function initSkills() {
  loadSkills();

  // Re-cargar habilidades cuando cambia el idioma
  document.addEventListener('languageChange', () => {
    loadSkills();
  });
}
