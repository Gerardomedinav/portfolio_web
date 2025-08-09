// oscuro.js

// Seleccionamos ambos botones
const headerToggle = document.getElementById('darkModeToggle');
const widgetToggle = document.querySelector('.widget-dark-toggle');
const themeIcon = document.getElementById('theme-icon');
const widgetIcon = document.getElementById('widget-theme-icon');

// Detectar preferencia del sistema
const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme') || (userPrefersDark ? 'dark' : 'light');

// Aplicar tema guardado
if (savedTheme === 'dark') {
  document.body.classList.add('dark');
}

// Sincronizar iconos
function updateIcons() {
  const isDark = document.body.classList.contains('dark');
  if (themeIcon) {
    themeIcon.className = isDark ? 'bx bx-sun' : 'bx bx-moon';
  }
  if (widgetIcon) {
    widgetIcon.className = isDark ? 'bx bx-sun' : 'bx bx-moon';
  }
}

// Aplicar estado inicial
updateIcons();

// Función para alternar el tema
function toggleTheme() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateIcons(); // Actualiza ambos iconos
}

// Asignar evento a ambos botones
if (headerToggle) {
  headerToggle.addEventListener('click', toggleTheme);
}
if (widgetToggle) {
  widgetToggle.addEventListener('click', toggleTheme);
}

