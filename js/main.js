/**
 * MAIN.JS - Punto de Entrada Principal en ES Modules
 */
import { initNavigation } from './modules/navigation.js';
import { initTheme } from './modules/theme.js';
import { initI18n } from './modules/i18n.js';
import { initProjects } from './modules/projects.js';
import { initSkills } from './modules/skills.js';
import { initAccessibility } from './modules/accessibility.js';
import { initContactForm } from './modules/contact.js';
import { initDataStore } from './modules/dataStore.js';
import { initHome } from './modules/home.js';
import { initAbout } from './modules/about.js';
import { initFooterContact } from './modules/footerContact.js';
import { initAdminModal, openAdminModal } from './modules/adminModal.js';
import { initChatbot } from './modules/chatbotModal.js';
import { initPreloader, updatePreloaderProgress } from './modules/preloader.js';

// Inicializar Preloader inmediatamente
initPreloader();
updatePreloaderProgress(15, '⚡ Cargando arquitectura visual y estilos modulares...');

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    // Paso 1: Almacén Central de Datos y Seguridad SHA-256
    initDataStore();
    updatePreloaderProgress(35, '🔑 Inicializando almacén de datos DataStore...');

    setTimeout(() => {
      // Paso 2: Secciones dinámicas (Banner, Sobre Mí, Contacto y Footer)
      initHome();
      initAbout();
      initFooterContact();
      initNavigation();
      initTheme();
      initI18n();
      updatePreloaderProgress(60, '💼 Cargando proyectos, habilidades y recursos...');

      setTimeout(() => {
        // Paso 3: Componentes avanzados, proyectos y habilidades
        initProjects();
        initSkills();
        initContactForm();
        initAccessibility();
        updatePreloaderProgress(85, '🤖 Conectando Asistente Virtual GerAssist con IA...');

        setTimeout(() => {
          // Paso 4: GerAssist & Panel de Administración CRUD
          initChatbot();
          initAdminModal();
          updatePreloaderProgress(100, '🚀 ¡Portafolio listo! Bienvenido...');

          // Escuchador para el botón de acceso de administración (🔑)
          const adminBtn = document.getElementById('admin-access-btn');
          if (adminBtn) {
            adminBtn.addEventListener('click', () => {
              openAdminModal();
            });
          }
        }, 300);
      }, 250);
    }, 200);
  }, 100);
});
