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

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar Almacén Central de Datos
  initDataStore();

  // Inicializar Sección Inicio / Banner Dinámico
  initHome();

  // Inicializar Sección Sobre Mí Dinámica
  initAbout();

  // Inicializar Datos de Contacto y Footer Dinámicos
  initFooterContact();

  // Inicializar Navegación y Menú
  initNavigation();

  // Inicializar Tema Oscuro / Claro
  initTheme();

  // Inicializar Motor de Traducciones (i18n)
  initI18n();

  // Inicializar Carga Dinámica de Proyectos
  initProjects();

  // Inicializar Carga Dinámica de Habilidades
  initSkills();

  // Inicializar Formulario de Contacto
  initContactForm();

  // Inicializar Suite de Accesibilidad (Voz, Daltonismo, Tipografía)
  initAccessibility();

  // Inicializar Asistente Virtual Inteligente (GerAssist)
  initChatbot();

  // Inicializar Modal de Administración & CRUD
  initAdminModal();

  // Escuchador para el botón de acceso de administración (🔑)
  const adminBtn = document.getElementById('admin-access-btn');
  if (adminBtn) {
    adminBtn.addEventListener('click', () => {
      openAdminModal();
    });
  }
});
