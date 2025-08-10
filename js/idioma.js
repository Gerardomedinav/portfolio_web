const texts = {
  es: {
    home: "Inicio",
    about: "Sobre mí",
    projects: "Proyectos",
    skills: "Habilidades",
    contact: "Contacto",
    contactName: "Nombre",
    contactEmail: "Correo electrónico",
    contactMessage: "Mensaje",
    contactSend: "Enviar mensaje",
    footerCopy: "© 2024 Gerardo Medina - Todos los derechos reservados",
    readMoreBack: "Volver",
    readMore: "Leer más"
   

  },
  en: {
    home: "Home",
    about: "About",
    projects: "Projects",
    skills: "Skills",
    contact: "Contact",
    contactName: "Name",
    contactEmail: "Email",
    contactMessage: "Message",
    contactSend: "Send Message",
    footerCopy: "© 2024 Gerardo Medina - All rights reserved",
    readMoreBack: "Go back",
    readMore: "Read more"
   
  }
};

const translations = {
  en: {
    homeTitle: "Hi, <br /> I'm <span class='home__title-color'>Gerardo</span> <br /> Full Stack Developer Jr.",
    resume: "Resume",
    aboutTitle: "About me",
    aboutSubtitle: "I'm Gerardo Medina",
    aboutText: `I am a University Technician in Programming and in Software Analysis and Design, with a Junior Full Stack profile focused on web development. In addition, I have over 15 years of experience in the family retail business, working in customer service, administration, and management. This background has helped me develop interpersonal skills, problem-solving abilities, and a strong user-experience focus — all of which I bring into every software project I build. I am passionate about programming, music, and coffee. Discipline, dedication, and commitment are values that define me. I always give my best in every task, no matter how simple or complex it may be. Below, you’ll find some of the projects I’ve developed so far. Hope you enjoy them!`,
    projectsTitle: "Projects",
    skills: "Skills",
    skillsSubtitle: "My languages, frameworks, technologies & tools:",
    skillsLanguage: "Language",
    skillsFrameworks: "Frameworks & Library",
    skillsTechnologies: "Technologies & Tools",
    contact: "Contact",
    contactText: "Call me, write me an e-mail, or connect and chat with me on Linkedin.",
    footerThanks: 'Thank you for watching <img src="./assets/icon/icons8-grinning-face-with-smiling-eyes-30.png" alt="" />',
    footerCopyright: `Created by <a class="link-github" href="https://github.com/gerardomedinav"  target="_blank" rel="noreferrer noopener">gerardomedinav</a> | 2022 Copyright &copy All Rights Reserved`,
       footerEmojiAlt: "Smiling face emoji with smiling eyes",
    footerGithubLabel: "Visit Gerardo Medina's GitHub profile",
    accessibilitySlogan: "<strong>For a more inclusive, usable, human, and accessible web for everyone.</strong>",
    accessibilityText: "This website complies with WCAG 2.1 AA standards and includes an accessibility widget to improve the browsing experience." ,
        widgetTitle: "Accessibility Panel",
    widgetVideo: "Videos",
    widgetTheme: "Theme",
    widgetLanguage: "Language"
  },
  es: {
    homeTitle: "Hola, <br /> Soy <span class='home__title-color'>Gerardo</span> <br /> Desarrollador Full Stack Jr.",
    resume: "Currículum",
    aboutTitle: "Sobre mí",
    aboutSubtitle: "Soy Gerardo Medina",
    aboutText: `Técnico Universitario en Programación y en Análisis y Diseño de Software, con perfil Full Stack Junior orientado al desarrollo web. Además, tengo más de 15 años de experiencia en el negocio familiar de ventas al por menor, desempeñándome en atención al cliente, administración y gestión. Esta trayectoria me ayudó a desarrollar habilidades interpersonales, capacidad de resolución de problemas y una fuerte orientación a la experiencia del usuario, cualidades que aplico en cada proyecto de software que desarrollo. Me apasiona la programación, la música y el café. La disciplina, la dedicación y el compromiso son valores que me definen. Siempre doy lo mejor de mí en cada tarea, sin importar si es simple o compleja. A continuación, encontrarás algunos de los proyectos que desarrollé hasta ahora. ¡Espero que los disfrutes!`,
    projectsTitle: "Proyectos",
    skills: "Habilidades",
    skillsSubtitle: "Mis lenguajes, frameworks, tecnologías y herramientas:",
    skillsLanguage: "Lenguaje",
    skillsFrameworks: "Frameworks y Librerías",
    skillsTechnologies: "Tecnologías y Herramientas",
    contact: "Contacto",
    contactText: "Lláma, escríbeme un correo electrónico o conéctate y chatea conmigo en Linkedin.",
    footerThanks: 'Gracias por visitar <img src="./assets/icon/icons8-grinning-face-with-smiling-eyes-30.png" alt="" />',
    footerCopyright: `Creado por <a class="link-github" href="https://github.com/gerardomedinav"  target="_blank" rel="noreferrer noopener">gerardomedinav</a> | 2022 Derechos Reservados &copy`,
     footerEmojiAlt: "Emoji de cara sonriente con ojos sonrientes",
    footerGithubLabel: "Visitar el perfil de GitHub de Gerardo Medina",
      accessibilitySlogan: "<strong>Por una web más inclusiva, usable, humana y más accesible para todos.</strong>",
    accessibilityText: "Este sitio web cumple con las normas WCAG 2.1 AA y cuenta con un widget de accesibilidad para mejorar la experiencia de navegación.",
        widgetTitle: "Panel de Accesibilidad",
    widgetVideo: "Videos",
    widgetTheme: "Tema",
    widgetLanguage: "Idioma"
  }
};

// Idiomas disponibles y por defecto
const availableLangs = ['en', 'es'];
const defaultLang = 'en';

function getLang() {
  return localStorage.getItem('lang') || defaultLang;
}

function setLanguage(lang) {
  if (!availableLangs.includes(lang)) return;

  document.querySelector('a[href="#home"]').textContent = texts[lang].home;
  document.querySelector('a[href="#about"]').textContent = texts[lang].about;
  document.querySelector('a[href="#projects"]').textContent = texts[lang].projects;
  document.querySelector('a[href="#skills"]').textContent = texts[lang].skills;
  document.querySelector('a[href="#contact"]').textContent = texts[lang].contact;

  const labelName = document.querySelector('label[for="name"]');
  const labelEmail = document.querySelector('label[for="email"]');
  const labelMessage = document.querySelector('label[for="message"]');
  const btnSend = document.querySelector('button[type="submit"]');
  const footerCopy = document.querySelector('.footer__copy');

  if (labelName) labelName.textContent = texts[lang].contactName;
  if (labelEmail) labelEmail.textContent = texts[lang].contactEmail;
  if (labelMessage) labelMessage.textContent = texts[lang].contactMessage;
  if (btnSend) btnSend.textContent = texts[lang].contactSend;
  if (footerCopy) footerCopy.textContent = texts[lang].footerCopy;
}


function translatePage(lang) {
  if (!availableLangs.includes(lang)) return;

  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key]) {
      el.innerHTML = translations[lang][key];
    }
  });
}

function initLanguage() {
  let savedLang = localStorage.getItem('lang') || defaultLang;

  // Validar idioma guardado
  if (!availableLangs.includes(savedLang)) {
    savedLang = defaultLang;
  }

  // Establecer selector y traducciones
  const languageSelectors = [
  document.getElementById('language-select-header'),
  document.getElementById('language-select-widget')
].filter(Boolean); // Quita nulls por si alguno no existe

languageSelectors.forEach(selector => {
  selector.value = savedLang;
  selector.addEventListener('change', (e) => {
    const lang = e.target.value;
    if (availableLangs.includes(lang)) {
      localStorage.setItem('lang', lang);

      // Sincroniza ambos selectores
      languageSelectors.forEach(s => {
        if (s !== e.target) s.value = lang;
      });

      setLanguage(lang);
      translatePage(lang);
      updateResumeLink(lang);
      loadProjects();
    }
  });
});

  function updateResumeLink(lang) {
  const resumeLink = document.querySelector('a[data-i18n="resume"]');
  if (resumeLink) {
    if (lang === 'es') {
      resumeLink.href = './assets/CV_Gerardo_Medina_Villalba_español.pdf';
      resumeLink.setAttribute('download', 'CV_Gerardo_Medina_Villalba_español.pdf');
    } else {
      resumeLink.href = './assets/CV_Gerardo_Medina_Villalba_EN.pdf';
      resumeLink.setAttribute('download', 'CV_Gerardo_Medina_Villalba_EN.pdf');
    }
  }
}


  setLanguage(savedLang);
  translatePage(savedLang);
  updateResumeLink(savedLang);
}

// Función para cargar proyectos
function loadProjects() {
  const lang = getLang();

  fetch('./assets/json/proyectos.json')
    .then(response => response.json())
    .then(data => renderProjects(data, lang))
    .catch(error => console.error("Error cargando los proyectos:", error));
}

function translatePage(lang) {
  if (!availableLangs.includes(lang)) return;

  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key]) {
      el.innerHTML = translations[lang][key];
    }
  });

  // Traducción de atributos alt
  const altElements = document.querySelectorAll('[data-i18n-alt]');
  altElements.forEach(el => {
    const key = el.getAttribute('data-i18n-alt');
    if (translations[lang][key]) {
      el.alt = translations[lang][key];
    }
  });

  // Traducción de atributos aria-label
  const ariaElements = document.querySelectorAll('[data-i18n-aria]');
  ariaElements.forEach(el => {
    const key = el.getAttribute('data-i18n-aria');
    if (translations[lang][key]) {
      el.setAttribute('aria-label', translations[lang][key]);
    }
  });
}


// Inicializar traducción y carga de proyectos al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  loadProjects();
});