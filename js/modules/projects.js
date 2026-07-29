/**
 * Módulo de Carga y Renderizado Dinámico de Proyectos con Popovers Aislados
 */
import { getLang, texts } from './i18n.js';

export function loadProjects() {
  const lang = getLang();

  fetch('./assets/json/proyectos.json')
    .then(response => {
      if (!response.ok) {
        throw new Error("No se pudo cargar el JSON de proyectos");
      }
      return response.json();
    })
    .then(data => renderProjects(data, lang))
    .catch(error => console.error("Error cargando los proyectos:", error));
}

export function renderProjects(projects, lang) {
  const container = document.querySelector(".projects__container");
  if (!container) return;

  container.innerHTML = "";

  const currentTexts = texts[lang] || texts.es;

  const aosAnimations = [
    "fade-right",  // Ingresa desde la izquierda
    "fade-down",   // Ingresa desde arriba
    "fade-left",   // Ingresa desde la derecha
    "fade-up",     // Ingresa desde abajo
    "zoom-in-right",
    "zoom-in-left"
  ];

  projects.forEach((project, index) => {
    // 1. Tarjeta de Proyecto
    const projectCard = document.createElement("article");
    projectCard.className = "projects__links";
    projectCard.dataset.aos = aosAnimations[index % aosAnimations.length];
    projectCard.dataset.aosDuration = "800";

    const fullDesc = project.description[lang] || "";
    const shortDesc = fullDesc.length > 100 ? fullDesc.substring(0, 100) + "..." : fullDesc;

    const thumbnailAlt = lang === 'es' 
      ? `Captura de portada del proyecto ${project.title[lang]}` 
      : `Thumbnail screenshot for project ${project.title[lang]}`;

    const popoverAlt = lang === 'es'
      ? `Vista previa ampliada y detallada del proyecto ${project.title[lang]}`
      : `Enlarged detailed screenshot for project ${project.title[lang]}`;

    projectCard.innerHTML = `
      <div class="project__img-wrapper">
        <img 
          class="project" 
          src="${project.image}" 
          alt="${thumbnailAlt}" 
          loading="lazy"
        />
      </div>
      
      <div class="project__body">
        <h3 class="project__title">${project.title[lang]}</h3>
        <p class="project__snippet">${shortDesc}</p>
      </div>

      <div class="project__footer">
        <div class="project__link-item">
          <a href="${project.github}" class="project__item" target="_blank" rel="noopener noreferrer" aria-label="Código de ${project.title[lang]} en GitHub">
            <i class="bx bxl-github"></i>
            <span>Code</span>
          </a>
          <a href="${project.demo}" class="project__item project__item--demo" target="_blank" rel="noopener noreferrer" aria-label="Demo en vivo de ${project.title[lang]}">
            <i class="bx bx-globe"></i>
            <span>Demo</span>
          </a>
        </div>

        <button popovertarget="popover-${index}" class="project__more-btn" aria-label="Más información sobre ${project.title[lang]}">
          <span>${currentTexts.readMore}</span>
          <i class="bx bx-right-arrow-alt"></i>
        </button>
      </div>
    `;

    // 2. Elemento Popover fuera de la tarjeta para aislarlo del flujo grid
    const popoverDiv = document.createElement("div");
    popoverDiv.id = `popover-${index}`;
    popoverDiv.setAttribute("popover", "auto");
    popoverDiv.className = "project__popover";

    popoverDiv.innerHTML = `
      <button popovertarget="popover-${index}" popovertargetaction="hide" class="project__popover-close-top" aria-label="Cerrar modal">
        <i class="bx bx-x"></i>
      </button>

      <div class="project__popover-header">
        <img 
          src="${project.image}" 
          alt="${popoverAlt}" 
          class="project__popover-img"
        />
      </div>
      <div class="project__popover-body">
        <h3 class="project__popover-title">${project.title[lang]}</h3>
        <p class="project__popover-desc">${project.description[lang]}</p>

        <div class="project__popover-footer">
          <div class="project__popover-links">
            <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="project__popover-link" aria-label="Ir al repositorio de ${project.title[lang]} en GitHub">
              <i class="bx bxl-github"></i> Repositorio
            </a>
            <a href="${project.demo}" target="_blank" rel="noopener noreferrer" class="project__popover-link project__popover-link--demo" aria-label="Abrir demo en vivo de ${project.title[lang]}">
              <i class="bx bx-globe"></i> Ver Demo
            </a>
          </div>

          <button popovertarget="popover-${index}" popovertargetaction="hide" class="project__close-btn" aria-label="Cerrar información de ${project.title[lang]}">
            <i class="bx bx-x"></i> ${currentTexts.readMoreBack}
          </button>
        </div>
      </div>
    `;

    container.appendChild(projectCard);
    container.appendChild(popoverDiv);
  });

  // Fallback JS para navegadores o comportamientos donde el API popover no oculte el elemento por defecto
  initPopoverFallback();

  // Refrescar animaciones AOS para elementos dinámicos
  if (typeof window !== "undefined" && window.AOS) {
    window.AOS.refresh();
  }
}

function initPopoverFallback() {
  const popovers = document.querySelectorAll('.project__popover');
  popovers.forEach(pop => {
    // Si el navegador no soporta popover-open nativo o el elemento no está abierto, asegurarse de que no interfiera
    if (!pop.matches(':popover-open')) {
      pop.style.display = 'none';
    }
  });

  // Escuchar eventos toggle nativos de popover
  popovers.forEach(pop => {
    pop.addEventListener('toggle', (e) => {
      if (e.newState === 'open') {
        pop.style.display = 'flex';
      } else {
        pop.style.display = 'none';
      }
    });
  });

  // Listener fallback para botones popovertarget si no hay soporte nativo
  document.querySelectorAll('[popovertarget]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetId = btn.getAttribute('popovertarget');
      const action = btn.getAttribute('popovertargetaction') || 'toggle';
      const targetPop = document.getElementById(targetId);

      if (targetPop && typeof targetPop.showPopover !== 'function') {
        e.preventDefault();
        if (action === 'hide') {
          targetPop.style.display = 'none';
        } else {
          targetPop.style.display = targetPop.style.display === 'flex' ? 'none' : 'flex';
        }
      }
    });
  });
}

export function initProjects() {
  loadProjects();

  document.addEventListener('languageChange', () => {
    loadProjects();
  });
}
