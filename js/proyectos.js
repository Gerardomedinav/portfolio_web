document.addEventListener("DOMContentLoaded", () => {
  // Cargar proyectos al iniciar
  loadProjects();
});

function loadProjects() {
  const lang = localStorage.getItem('lang') || 'en';

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

function renderProjects(projects, lang) {
  const container = document.querySelector(".projects__container");
  if (!container) return;

  container.innerHTML = ""; // Limpiar contenido previo

  projects.forEach((project, index) => {
    const projectDiv = document.createElement("div");
    projectDiv.className = "projects__links";
    projectDiv.dataset.aos = "fade-down";

  projectDiv.innerHTML = `
  <img src="${project.image}" alt="${project.title[lang]}" />
  <h4 class="project__title">${project.title[lang]}</h4>

  <div class="project__link-item">
    <a href="${project.github}" class="project__item" target="_blank"><i class="bx bxl-github"></i></a>
    <a href="${project.demo}" class="project__item" target="_blank"><i class="bx bx-globe"></i></a>
  </div>

  <button popovertarget="popover-${index}" class="project__more-btn">${texts[lang].readMore}</button>

  <div id="popover-${index}" popover class="project__popover">
    <img src="${project.image}" alt="${project.title[lang]}" class="project__popover-img"/>
    <h4 class="project__popover-title">${project.title[lang]}</h4>
    <p class="project__popover-desc">${project.description[lang]}</p>

    <div class="project__popover-links">
      <a href="${project.github}" target="_blank" class="project__popover-link">
        <i class="bx bxl-github"></i> Repositorio
      </a>
      <a href="${project.demo}" target="_blank" class="project__popover-link">
        <i class="bx bx-globe"></i> Ver Demo
      </a>
    </div>

    <button popovertarget="popover-${index}" popovertargetaction="hide" class="project__close-btn">${texts[lang].readMoreBack}</button>
  </div>
`;
    container.appendChild(projectDiv);
  });
}