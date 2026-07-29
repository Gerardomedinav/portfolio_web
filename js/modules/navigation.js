/**
 * Módulo de Navegación, Menú Responsive y Widget de Accesibilidad
 */
export function initNavigation() {
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');
  const navLinks = document.querySelectorAll('.nav__link');

  // Abrir / Cerrar Menú Móvil
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.add('show');
      navToggle.setAttribute('aria-expanded', 'true');
    });
  }

  if (navClose && navMenu) {
    navClose.addEventListener('click', () => {
      navMenu.classList.remove('show');
      if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    });
  }

  // Activar enlace al hacer click y cerrar menú en móvil
  navLinks.forEach(link => {
    link.addEventListener('click', function () {
      navLinks.forEach(n => n.classList.remove('active'));
      this.classList.add('active');
      if (navMenu) navMenu.classList.remove('show');
      if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // WIDGET DE ACCESIBILIDAD
  const widgetToggle = document.getElementById("widget-toggle");
  const widgetPanel = document.getElementById("widget-panel");

  if (widgetToggle && widgetPanel) {
    widgetToggle.addEventListener("click", (e) => {
      e.stopPropagation();
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
  }

  // CONTROL DE VIDEOS
  const toggleVideoBtn = document.getElementById("toggle-video");
  const videoIcon = document.getElementById("video-icon");
  const backgroundVideo = document.getElementById("background-video");
  const homeVideo = document.querySelector(".video-bg");
  const aboutVideo = document.querySelector(".about-video");

  const videos = [backgroundVideo, homeVideo, aboutVideo].filter(Boolean);
  let isVideoPlaying = true;

  const pauseVideos = () => {
    videos.forEach(v => v.pause && v.pause());
    isVideoPlaying = false;
    if (videoIcon) videoIcon.className = "bx bx-play";
    if (toggleVideoBtn) {
      toggleVideoBtn.setAttribute("aria-pressed", "false");
      toggleVideoBtn.setAttribute("aria-label", "Reproducir videos de fondo");
    }
  };

  const playVideos = () => {
    videos.forEach(v => v.play && v.play().catch(e => console.warn("Autoplay bloqueado", e)));
    isVideoPlaying = true;
    if (videoIcon) videoIcon.className = "bx bx-pause";
    if (toggleVideoBtn) {
      toggleVideoBtn.setAttribute("aria-pressed", "true");
      toggleVideoBtn.setAttribute("aria-label", "Pausar videos de fondo");
    }
  };

  if (toggleVideoBtn) {
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
  }
}
