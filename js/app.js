// ===== MOSTRAR / OCULTAR MENÚ =====
const showMenu = (toggleId, navId) => {
  const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId);

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('show'); // Usamos la misma clase para abrir/cerrar
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
  navMenu.classList.remove('show'); // Misma clase
}

navLink.forEach((n) => n.addEventListener('click', linkAction));

// ===== WIDGET DE ACCESIBILIDAD =====
document.addEventListener("DOMContentLoaded", () => {
  const widgetToggle = document.getElementById("widget-toggle");
  const widgetPanel = document.getElementById("widget-panel");

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
    localStorage.setItem("videoPlaying", isVideoPlaying);
  });

  const savedVideoState = localStorage.getItem("videoPlaying");
  if (savedVideoState === "false") {
    pauseVideos();
  }

  // ===== IDIOMA =====
  const langSelect = document.getElementById("language-select");
  if (langSelect) {
    langSelect.addEventListener("change", () => {
      cambiarIdioma(langSelect.value);
    });

    const savedLang = localStorage.getItem("language") || "en";
    langSelect.value = savedLang;
  }

  // ===== MODO OSCURO =====
  const darkModeToggle = document.getElementById("darkModeToggle");
  const themeIcon = document.getElementById("theme-icon");

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

// === CAMBIO DE IDIOMA ===
function cambiarIdioma(lang) {
  console.log("Idioma cambiado a:", lang);
  localStorage.setItem("language", lang);
}

// ===== BOTÓN CERRAR MENÚ =====
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');

// Abrir menú
navToggle.addEventListener('click', () => {
  navMenu.classList.add('show'); // Misma clase
});

// Cerrar menú
navClose.addEventListener('click', () => {
  navMenu.classList.remove('show'); // Misma clase
});
