/**
 * Módulo Central DataStore para Gestión de Contenidos Dinámicos del Portafolio
 */

const STORAGE_BANNER_KEY = "portfolio_banner_data";
const STORAGE_ABOUT_KEY = "portfolio_about_data";
const STORAGE_PROJECTS_KEY = "portfolio_projects_data";

// 1. Datos por defecto del Banner / Inicio
export const defaultBannerData = {
  greeting: {
    es: "Hola,",
    en: "Hi,"
  },
  name: {
    es: "Gerardo",
    en: "Gerardo"
  },
  role: {
    es: "Full Stack Developer Jr.",
    en: "Full Stack Developer Jr."
  },
  profileImg: "./assets/img/profile/yo.PNG",
  cv: {
    es: "./assets/CV_Gerardo_Medina_Villalba_español.pdf",
    en: "./assets/CV_Gerardo_Medina_Villalba_EN.pdf"
  },
  social: {
    linkedin: "https://www.linkedin.com/in/gerardomedinav/",
    github: "https://github.com/gerardomedinav",
    email: "https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=gerardomedinavv@gmail.com"
  }
};

// 2. Datos por defecto de Sobre Mí / About
export const defaultAboutData = {
  subtitle: {
    es: "Desarrollador Full Stack enfocado en calidad, accesibilidad y experiencia de usuario",
    en: "Full Stack Developer focused on quality, accessibility & user experience"
  },
  text: {
    es: `Técnico Universitario en Programación y en Análisis y Diseño de Software, con perfil Full Stack Junior orientado al desarrollo web. Además, tengo más de 15 años de experiencia en el negocio familiar de ventas al por menor, desempeñándome en atención al cliente, administración y gestión. Esta trayectoria me ayudó a desarrollar habilidades interpersonales, capacidad de resolución de problemas y una fuerte orientación a la experiencia del usuario, cualidades que aplico en cada proyecto de software que desarrollo. Me apasiona la programación, la música y el café. La disciplina, la dedicación y el compromiso son valores que me definen. Siempre doy lo mejor de mí en cada tarea, sin importar si es simple o compleja. A continuación, encontrarás algunos de los proyectos que desarrollé hasta ahora. ¡Espero que los disfrutes!`,
    en: `I am a University Technician in Programming and in Software Analysis and Design, with a Junior Full Stack profile focused on web development. In addition, I have over 15 years of experience in the family retail business, working in customer service, administration, and management. This background has helped me develop interpersonal skills, problem-solving abilities, and a strong user-experience focus — all of which I bring into every software project I build. I am passionate about programming, music, and coffee. Discipline, dedication, and commitment are values that define me. I always give my best in every task, no matter how simple or complex it may be. Below, you’ll find some of the projects I’ve developed so far. Hope you enjoy them!`
  },
  photoImg: "./assets/img/profile/perfil2.JPG"
};

/**
 * Obtiene los datos del Banner
 */
export function getBannerData() {
  try {
    const raw = localStorage.getItem(STORAGE_BANNER_KEY);
    if (!raw) return { ...defaultBannerData };
    const parsed = JSON.parse(raw);
    return {
      greeting: { ...defaultBannerData.greeting, ...(parsed.greeting || {}) },
      name: { ...defaultBannerData.name, ...(parsed.name || {}) },
      role: { ...defaultBannerData.role, ...(parsed.role || {}) },
      profileImg: parsed.profileImg || defaultBannerData.profileImg,
      cv: { ...defaultBannerData.cv, ...(parsed.cv || {}) },
      social: { ...defaultBannerData.social, ...(parsed.social || {}) }
    };
  } catch (e) {
    return { ...defaultBannerData };
  }
}

/**
 * Guarda los datos del Banner
 */
export function saveBannerData(newData) {
  try {
    const current = getBannerData();
    const updated = {
      ...current,
      ...newData,
      greeting: { ...current.greeting, ...(newData.greeting || {}) },
      name: { ...current.name, ...(newData.name || {}) },
      role: { ...current.role, ...(newData.role || {}) },
      cv: { ...current.cv, ...(newData.cv || {}) },
      social: { ...current.social, ...(newData.social || {}) }
    };
    localStorage.setItem(STORAGE_BANNER_KEY, JSON.stringify(updated));
    document.dispatchEvent(new CustomEvent("bannerDataChange", { detail: updated }));
    return true;
  } catch (e) {
    console.error("Error guardando datos del banner:", e);
    return false;
  }
}

/**
 * Restablece los datos del Banner
 */
export function resetBannerData() {
  try {
    localStorage.removeItem(STORAGE_BANNER_KEY);
    document.dispatchEvent(new CustomEvent("bannerDataChange", { detail: defaultBannerData }));
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Obtiene los datos de la sección Sobre Mí
 */
export function getAboutData() {
  try {
    const raw = localStorage.getItem(STORAGE_ABOUT_KEY);
    if (!raw) return { ...defaultAboutData };
    const parsed = JSON.parse(raw);
    return {
      subtitle: { ...defaultAboutData.subtitle, ...(parsed.subtitle || {}) },
      text: { ...defaultAboutData.text, ...(parsed.text || {}) },
      photoImg: parsed.photoImg || defaultAboutData.photoImg
    };
  } catch (e) {
    return { ...defaultAboutData };
  }
}

/**
 * Guarda los datos de Sobre Mí
 */
export function saveAboutData(newData) {
  try {
    const current = getAboutData();
    const updated = {
      ...current,
      ...newData,
      subtitle: { ...current.subtitle, ...(newData.subtitle || {}) },
      text: { ...current.text, ...(newData.text || {}) }
    };
    localStorage.setItem(STORAGE_ABOUT_KEY, JSON.stringify(updated));
    document.dispatchEvent(new CustomEvent("aboutDataChange", { detail: updated }));
    return true;
  } catch (e) {
    console.error("Error guardando datos de sobre mí:", e);
    return false;
  }
}

/**
 * Restablece los datos de Sobre Mí
 */
export function resetAboutData() {
  try {
    localStorage.removeItem(STORAGE_ABOUT_KEY);
    document.dispatchEvent(new CustomEvent("aboutDataChange", { detail: defaultAboutData }));
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Obtiene los proyectos (desde localStorage o carga inicial desde proyectos.json)
 */
export async function getProjectsData() {
  try {
    const raw = localStorage.getItem(STORAGE_PROJECTS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {}

  // Fallback desde el JSON original
  try {
    const res = await fetch('./assets/json/proyectos.json');
    if (res.ok) {
      const defaultProjects = await res.json();
      return defaultProjects;
    }
  } catch (e) {
    console.error("Error cargando proyectos.json por defecto:", e);
  }
  return [];
}

/**
 * Guarda la lista de proyectos en localStorage y notifica cambios
 */
export function saveProjectsData(projectsList) {
  try {
    localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(projectsList));
    document.dispatchEvent(new CustomEvent("projectsDataChange", { detail: projectsList }));
    return true;
  } catch (e) {
    console.error("Error guardando proyectos:", e);
    return false;
  }
}

/**
 * Restablece la lista de proyectos a los valores originales de proyectos.json
 */
export async function resetProjectsData() {
  try {
    localStorage.removeItem(STORAGE_PROJECTS_KEY);
    const originalProjects = await getProjectsData();
    document.dispatchEvent(new CustomEvent("projectsDataChange", { detail: originalProjects }));
    return true;
  } catch (e) {
    return false;
  }
}

export function initDataStore() {
  // Inicialización del almacén de datos
}
