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

document.addEventListener('DOMContentLoaded', () => {
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
});
