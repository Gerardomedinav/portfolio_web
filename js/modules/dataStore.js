/**
 * Módulo Central DataStore para Gestión de Contenidos Dinámicos del Portafolio
 */

const STORAGE_BANNER_KEY = "portfolio_banner_data";

// Datos por defecto del Banner / Inicio (Estructura limpia sin HTML)
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

/**
 * Obtiene los datos del Banner (desde localStorage o valores por defecto)
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
      bgVideo: parsed.bgVideo || defaultBannerData.bgVideo,
      cv: { ...defaultBannerData.cv, ...(parsed.cv || {}) },
      social: { ...defaultBannerData.social, ...(parsed.social || {}) }
    };
  } catch (e) {
    return { ...defaultBannerData };
  }
}

/**
 * Guarda los datos del Banner en localStorage y notifica los cambios al DOM
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
 * Restablece los datos del Banner a los valores por defecto
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

export function initDataStore() {
  // Inicialización del almacén de datos
}
