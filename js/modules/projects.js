/**
 * Módulo de Carga y Renderizado Dinámico de Proyectos con Popovers Aislados
 */
import { getLang, texts } from './i18n.js';
import { getProjectsData } from './dataStore.js';

export async function loadProjects() {
  const lang = getLang();
  try {
    const projects = await getProjectsData();
    renderProjects(projects, lang);
  } catch (error) {
    console.error("Error cargando los proyectos:", error);
  }
}

export function renderProjects(projects, lang) {
  const container = document.querySelector(".projects__container");
  if (!container) return;

  container.innerHTML = "";

  const currentTexts = texts[lang] || texts.es;

  const aosAnimations = [
    "fade-right",
    "fade-down",
    "fade-left",
    "fade-up",
    "zoom-in-right",
    "zoom-in-left"
  ];

  projects.forEach((project, index) => {
    const projectCard = document.createElement("article");
    projectCard.className = "projects__links";
    projectCard.dataset.aos = aosAnimations[index % aosAnimations.length];
    projectCard.dataset.aosDuration = "800";

    const titleText = (project.title && (project.title[lang] || project.title.es)) || "Proyecto";
    const fullDesc = (project.description && (project.description[lang] || project.description.es)) || "";
    const shortDesc = fullDesc.length > 100 ? fullDesc.substring(0, 100) + "..." : fullDesc;

    const thumbnailAlt = (project.imageAlt && (project.imageAlt[lang] || project.imageAlt.es)) || 
      (lang === 'es' ? `Captura de portada del proyecto ${titleText}` : `Thumbnail screenshot for project ${titleText}`);

    const popoverAlt = lang === 'es'
      ? `Vista previa ampliada y detallada del proyecto ${titleText}`
      : `Enlarged detailed screenshot for project ${titleText}`;

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
        <h3 class="project__title">${titleText}</h3>
        <p class="project__snippet">${shortDesc}</p>
      </div>

      <div class="project__footer">
        <div class="project__link-item">
          <a href="${project.github || '#'}" class="project__item" target="_blank" rel="noopener noreferrer" aria-label="Código de ${titleText} en GitHub">
            <i class="bx bxl-github"></i>
            <span>Code</span>
          </a>
          <a href="${project.demo || '#'}" class="project__item project__item--demo" target="_blank" rel="noopener noreferrer" aria-label="Demo en vivo de ${titleText}">
            <i class="bx bx-globe"></i>
            <span>Demo</span>
          </a>
        </div>

        <button popovertarget="popover-${index}" class="project__more-btn" aria-label="Más información sobre ${titleText}">
          <span>${currentTexts.readMore}</span>
          <i class="bx bx-right-arrow-alt"></i>
        </button>
      </div>
    `;

    const popoverDiv = document.createElement("div");
    popoverDiv.id = `popover-${index}`;
    popoverDiv.setAttribute("popover", "manual");
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
        <h3 class="project__popover-title">${titleText}</h3>
        <p class="project__popover-desc">${fullDesc}</p>

        <div class="project__popover-footer">
          <div class="project__popover-links">
            <a href="${project.github || '#'}" target="_blank" rel="noopener noreferrer" class="project__popover-link" aria-label="Ir al repositorio de ${titleText} en GitHub">
              <i class="bx bxl-github"></i> Repositorio
            </a>
            <a href="${project.demo || '#'}" target="_blank" rel="noopener noreferrer" class="project__popover-link project__popover-link--demo" aria-label="Abrir demo en vivo de ${titleText}">
              <i class="bx bx-globe"></i> Ver Demo
            </a>
          </div>

          <button popovertarget="popover-${index}" popovertargetaction="hide" class="project__close-btn" aria-label="Cerrar información de ${titleText}">
            <i class="bx bx-x"></i> ${currentTexts.readMoreBack}
          </button>
        </div>
      </div>
    `;

    container.appendChild(projectCard);
    container.appendChild(popoverDiv);
  });

  initPopoverFallback();

  if (typeof window !== "undefined" && window.AOS) {
    window.AOS.refresh();
  }
}

function initPopoverFallback() {
  const popovers = document.querySelectorAll('.project__popover');
  popovers.forEach(pop => {
    if (!pop.matches(':popover-open')) {
      pop.style.display = 'none';
    }
  });

  popovers.forEach(pop => {
    pop.addEventListener('toggle', (e) => {
      if (e.newState === 'open') {
        pop.style.display = 'flex';
      } else {
        pop.style.display = 'none';
      }
    });
  });

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

export function openProjectModalByName(queryText) {
  if (!queryText) return false;
  const cleanQuery = queryText.toLowerCase().trim();

  const popovers = document.querySelectorAll('.project__popover');
  let matchedPopover = null;

  popovers.forEach(pop => {
    const titleEl = pop.querySelector('.project__popover-title');
    const titleText = (titleEl ? titleEl.textContent : '').toLowerCase();

    if (
      (cleanQuery.includes('siga') && titleText.includes('siga')) ||
      (cleanQuery.includes('nexo') && titleText.includes('nexo')) ||
      (cleanQuery.includes('proyecoins') && titleText.includes('proyecoins')) ||
      (cleanQuery.includes('ahorcado') && titleText.includes('ahorcado')) ||
      (cleanQuery.includes('entrevigas') && titleText.includes('entrevigas')) ||
      (cleanQuery.includes('bytezar') && titleText.includes('bytezar')) ||
      (cleanQuery.includes('planificad') && titleText.includes('planificad')) ||
      (cleanQuery.includes('codigo urbano') && titleText.includes('código urbano')) ||
      (cleanQuery.includes('catalogo') && titleText.includes('catálogo')) ||
      (cleanQuery.includes('animal') && titleText.includes('comunitario')) ||
      (cleanQuery.includes('analytics') && titleText.includes('analytics'))
    ) {
      matchedPopover = pop;
    }
  });

  if (matchedPopover) {
    if (typeof matchedPopover.showPopover === 'function') {
      try {
        matchedPopover.showPopover();
      } catch (e) {
        matchedPopover.style.display = 'flex';
      }
    } else {
      matchedPopover.style.display = 'flex';
    }

    matchedPopover.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return true;
  }

  return false;
}

export function initProjects() {
  loadProjects();

  document.addEventListener('languageChange', () => {
    loadProjects();
  });

  document.addEventListener('projectsDataChange', () => {
    loadProjects();
  });
}
