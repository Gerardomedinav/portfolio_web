document.addEventListener("DOMContentLoaded", () => {
  const lang = localStorage.getItem('lang') || 'en';

  fetch('./assets/json/skill.json') 
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error al cargar skill.json: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      renderSkills(data.languages, 'skills-languages', lang);
      renderSkills(data.frameworks, 'skills-frameworks', lang);
      renderSkills(data.tools, 'skills-tools', lang);
    })
    .catch(error => console.error('Error:', error));
});

function renderSkills(skillsArray, containerId, lang) {
  const container = document.getElementById(containerId);
  if (!container) return;

  skillsArray.forEach(skill => {
    const link = document.createElement('a');
    link.href = skill.link;
    link.target = "_blank";
    link.className = 'skills__name';
    link.setAttribute('role', 'listitem');

    // Texto alternativo descriptivo según idioma
    const altText = lang === 'es'
      ? `Logo de ${skill.name}, herramienta o tecnología utilizada por Gerardo Medina`
      : `Logo of ${skill.name}, tool or technology used by Gerardo Medina`;

    const img = document.createElement('img');
    img.src = skill.image;
    img.alt = altText;

    // Agregar aria-label al enlace para accesibilidad extra
    link.setAttribute('aria-label', altText);

    link.appendChild(img);
    link.appendChild(document.createTextNode(skill.name));
    container.appendChild(link);
  });
}
