/**
 * Módulo de Navegación, Menú Responsive y Widget de Accesibilidad
 */

export function openAccessibilityPanel() {
  const widgetPanel = document.getElementById("widget-panel");
  const widgetToggle = document.getElementById("widget-toggle");
  if (widgetPanel) {
    widgetPanel.removeAttribute("hidden");
    if (widgetToggle) widgetToggle.setAttribute("aria-expanded", "true");
    widgetPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

export function closeAccessibilityPanel() {
  const widgetPanel = document.getElementById("widget-panel");
  const widgetToggle = document.getElementById("widget-toggle");
  if (widgetPanel) {
    widgetPanel.setAttribute("hidden", "");
    if (widgetToggle) widgetToggle.setAttribute("aria-expanded", "false");
  }
}

export function initNavigation() {
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');
  const navLinks = document.querySelectorAll('.nav__link');

  // Crear o referencia a overlay de fondo para menú móvil
  let navOverlay = document.getElementById('nav-overlay');
  if (!navOverlay) {
    navOverlay = document.createElement('div');
    navOverlay.id = 'nav-overlay';
    navOverlay.className = 'nav__overlay';
    document.body.appendChild(navOverlay);
  }

  const closeMenu = () => {
    if (navMenu) navMenu.classList.remove('show');
    if (navOverlay) navOverlay.classList.remove('show-overlay');
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'false');
      const icon = navToggle.querySelector('i');
      if (icon) icon.className = 'bx bx-menu';
    }
  };

  const openMenu = () => {
    if (navMenu) navMenu.classList.add('show');
    if (navOverlay) navOverlay.classList.add('show-overlay');
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'true');
      const icon = navToggle.querySelector('i');
      if (icon) icon.className = 'bx bx-x';
    }
  };

  const toggleMenu = () => {
    const isShow = navMenu && navMenu.classList.contains('show');
    if (isShow) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  // Abrir / Cerrar Menú Móvil al presionar el botón hamburguesa
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });
  }

  // Cerrar con botón X dentro del menú
  if (navClose) {
    navClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
    });
  }

  // Cerrar al hacer clic en el telón de fondo
  if (navOverlay) {
    navOverlay.addEventListener('click', () => {
      closeMenu();
    });
  }

  // Activar enlace al hacer click y cerrar menú en móvil
  navLinks.forEach(link => {
    link.addEventListener('click', function () {
      navLinks.forEach(n => n.classList.remove('active'));
      this.classList.add('active');
      closeMenu();
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
        openAccessibilityPanel();
      } else {
        closeAccessibilityPanel();
      }
    });

    document.addEventListener("click", (e) => {
      const botRoot = document.getElementById('gerassist-widget-root');
      if (
        !widgetPanel.contains(e.target) && 
        e.target !== widgetToggle &&
        (!botRoot || !botRoot.contains(e.target))
      ) {
        closeAccessibilityPanel();
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
