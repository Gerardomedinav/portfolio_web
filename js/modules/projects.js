/**
 * Módulo de Carga y Renderizado Dinámico de Proyectos con Modales Multisección Simultáneos a Nivel DOM Raíz
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

  // Limpiar cualquier popover o backdrop residual previo del DOM
  document.querySelectorAll('.project__popover, .project-modal-backdrop').forEach(el => el.remove());

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
    // IMPORTANTE: Se adjunta a document.body para evitar aislamiento de z-index provocado por stacking contexts internos
    document.body.appendChild(popoverDiv);
  });

  initProjectModals();

  if (typeof window !== "undefined" && window.AOS) {
    window.AOS.refresh();
  }
}

function getProjectBackdrop() {
  let backdrop = document.getElementById('project-modal-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'project-modal-backdrop';
    backdrop.className = 'project-modal-backdrop';
    document.body.appendChild(backdrop);

    backdrop.addEventListener('click', () => {
      closeAllProjectModals();
    });
  }
  return backdrop;
}

export function closeAllProjectModals() {
  document.querySelectorAll('.project__popover').forEach(pop => {
    pop.classList.remove('is-open');
    pop.style.display = 'none';
  });
  const backdrop = document.getElementById('project-modal-backdrop');
  if (backdrop) {
    backdrop.classList.remove('is-open');
    backdrop.style.display = 'none';
  }
}

function initProjectModals() {
  document.querySelectorAll('[popovertarget]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('popovertarget');
      const action = btn.getAttribute('popovertargetaction') || 'toggle';
      const targetPop = document.getElementById(targetId);

      if (action === 'hide') {
        closeAllProjectModals();
      } else if (targetPop) {
        closeAllProjectModals();
        const backdrop = getProjectBackdrop();

        // Mover backdrop y popover al final de body para que esten en la misma jerarquia
        document.body.appendChild(backdrop);
        document.body.appendChild(targetPop);

        // Si GerAssist existe, asegurar que GerAssist este despus de targetPop en el DOM
        const botRoot = document.getElementById('gerassist-widget-root');
        if (botRoot) {
          document.body.appendChild(botRoot);
        }

        backdrop.classList.add('is-open');
        backdrop.style.display = 'block';

        targetPop.classList.add('is-open');
        targetPop.style.display = 'flex';
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllProjectModals();
    }
  });
}

export function openProjectModalByName(queryText) {
  if (!queryText) return false;
  const cleanQuery = queryText.toLowerCase().trim();

  const popovers = document.querySelectorAll('.project__popover');
  let matchedPopover = null;

  // Palabras genéricas a ignorar para evitar falsos positivos
  const genericWords = new Set([
    'proyecto', 'proyectos', 'project', 'projects', 'desarrollo', 'sistema',
    'app', 'web', 'de', 'del', 'el', 'la', 'los', 'las', 'un', 'una', 'con',
    'para', 'por', 'en', 'y', 'e', 'o', 'u', 'sin', 'gerardo', 'medina', 'ver',
    'mostrar', 'abrir', 'como', 'cómo', 'que', 'qué', 'sobre', 'mas', 'más'
  ]);

  popovers.forEach(pop => {
    if (matchedPopover) return;

    const titleEl = pop.querySelector('.project__popover-title');
    const titleText = (titleEl ? titleEl.textContent : '').toLowerCase().trim();
    if (!titleText) return;

    // 1. Coincidencia directa si el texto de búsqueda contiene el título completo o viceversa
    if (cleanQuery.includes(titleText) || titleText.includes(cleanQuery)) {
      matchedPopover = pop;
      return;
    }

    // 2. Extraer palabras clave del título del proyecto (excluyendo genéricas y muy cortas)
    const titleWords = titleText
      .replace(/[^\w\sáéíóúñ-]/gi, ' ')
      .split(/\s+/)
      .filter(w => w.length >= 3 && !genericWords.has(w));

    // Si alguna palabra clave significativa del título del proyecto está presente en la consulta del usuario
    for (const word of titleWords) {
      if (cleanQuery.includes(word)) {
        matchedPopover = pop;
        break;
      }
    }
  });

  if (matchedPopover) {
    closeAllProjectModals();

    const backdrop = getProjectBackdrop();

    // Mover elementos al final de body para coordinar la pila DOM
    document.body.appendChild(backdrop);
    document.body.appendChild(matchedPopover);

    const botRoot = document.getElementById('gerassist-widget-root');
    if (botRoot) {
      document.body.appendChild(botRoot);
    }

    backdrop.classList.add('is-open');
    backdrop.style.display = 'block';

    matchedPopover.classList.add('is-open');
    matchedPopover.style.display = 'flex';

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
