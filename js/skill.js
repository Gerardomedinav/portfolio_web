document.addEventListener("DOMContentLoaded", () => {
  fetch('./assets/json/skill.json') 
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error al cargar skill.json: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      renderSkills(data.languages, 'skills-languages');
      renderSkills(data.frameworks, 'skills-frameworks');
      renderSkills(data.tools, 'skills-tools');
    })
    .catch(error => console.error('Error:', error));
});

function renderSkills(skillsArray, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  skillsArray.forEach(skill => {
    const link = document.createElement('a');
    link.href = skill.link;
    link.target = "_blank";
    link.className = 'skills__name';

    const img = document.createElement('img');
    img.src = skill.image;
    img.alt = skill.id;

    link.appendChild(img);
    link.appendChild(document.createTextNode(skill.name));
    container.appendChild(link);
  });
}
