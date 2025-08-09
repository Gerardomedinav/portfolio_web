const showMenu = (toggleId, navId) => {
  const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId);

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('show');
    });
  }
};

showMenu('nav-toggle', 'nav-menu');

const navLink = document.querySelectorAll('.nav__link');

function linkAction() {
  // Active Link
  navLink.forEach((n) => n.classList.remove('active'));
  this.classList.add('active');

  // Remove Menu
  const navMenu = document.getElementById('nav-menu');
  navMenu.classList.remove('show');
}

navLink.forEach((n) => n.addEventListener('click', linkAction));

// ===== WIDGET DE ACCESIBILIDAD =====
document.addEventListener("DOMContentLoaded", () => {
  const widgetToggle = document.getElementById("widget-toggle");
  const widgetPanel = document.getElementById("widget-panel");

  // Alternar panel
  widgetToggle.addEventListener("click", () => {
    const isHidden = widgetPanel.hasAttribute("hidden");
    if (isHidden) {
      widgetPanel.removeAttribute("hidden");
      widgetToggle.setAttribute("aria-expanded", "true");
    } else {
      widgetPanel.setAttribute("hidden", "");
      widgetToggle.setAttribute("aria-expanded", "false");
    }
  });

  // Cerrar al hacer clic fuera
  document.addEventListener("click", (e) => {
    if (!widgetPanel.contains(e.target) && e.target !== widgetToggle) {
      widgetPanel.setAttribute("hidden", "");
      widgetToggle.setAttribute("aria-expanded", "false");
    }
  });

  // ===== CONTROL DE VIDEOS =====
  const toggleVideoBtn = document.getElementById("toggle-video");
  const videoIcon = document.getElementById("video-icon");
  const backgroundVideo = document.getElementById("background-video");
  const homeVideo = document.querySelector(".video-bg");
  const aboutVideo = document.querySelector(".about-video");

  const videos = [backgroundVideo, homeVideo, aboutVideo].filter(v => v);

  let isVideoPlaying = true;

  const pauseVideos = () => {
    videos.forEach(v => v.pause());
    isVideoPlaying = false;
    videoIcon.className = "bx bx-play";
    toggleVideoBtn.setAttribute("aria-pressed", "false");
    toggleVideoBtn.setAttribute("aria-label", "Reproducir videos de fondo");
  };

  const playVideos = () => {
    videos.forEach(v => v.play().catch(e => console.warn("Autoplay bloqueado", e)));
    isVideoPlaying = true;
    videoIcon.className = "bx bx-pause";
    toggleVideoBtn.setAttribute("aria-pressed", "true");
    toggleVideoBtn.setAttribute("aria-label", "Pausar videos de fondo");
  };

  toggleVideoBtn.addEventListener("click", () => {
    if (isVideoPlaying) {
      pauseVideos();
    } else {
      playVideos();
    }
    // Guardar preferencia
    localStorage.setItem("videoPlaying", isVideoPlaying);
  });

  // Recuperar estado
  const savedVideoState = localStorage.getItem("videoPlaying");
  if (savedVideoState === "false") {
    pauseVideos();
  }

  // ===== IDIOMA (reutiliza tu funcionalidad) =====
  const langSelect = document.getElementById("language-select");
  if (langSelect) {
    langSelect.addEventListener("change", () => {
      // Aquí llamas a tu función de cambio de idioma
      // Asumiendo que tienes una función `cambiarIdioma(lang)`
      cambiarIdioma(langSelect.value);
    });

    // Recuperar idioma guardado
    const savedLang = localStorage.getItem("language") || "en";
    langSelect.value = savedLang;
  }

  // ===== MODO OSCURO (reutiliza tu funcionalidad) =====
  const darkModeToggle = document.getElementById("darkModeToggle");
  const themeIcon = document.getElementById("theme-icon");

  // Recuperar tema guardado
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    themeIcon.className = "bx bx-sun";
    darkModeToggle.setAttribute("aria-pressed", "true");
  }

  darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    const isDark = document.body.classList.contains("dark-theme");
    themeIcon.className = isDark ? "bx bx-sun" : "bx bx-moon";
    darkModeToggle.setAttribute("aria-pressed", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
});

// === Función de ejemplo para cambio de idioma (ajústala según tu `idioma.js`) ===
function cambiarIdioma(lang) {
  // Aquí iría tu lógica real (fetch, traducción, etc.)
  console.log("Idioma cambiado a:", lang);
  localStorage.setItem("language", lang);
  // Recargar o actualizar contenido
}