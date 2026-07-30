/**
 * Módulo de Gestión de Tema Oscuro / Claro
 */
export function initTheme() {
  const headerToggle = document.getElementById('darkModeToggle');
  const widgetToggle = document.querySelector('.widget-dark-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const widgetIcon = document.getElementById('widget-theme-icon');

  const savedTheme = localStorage.getItem('theme') || 'dark';

  // Aplicar estado inicial
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
  updateIcons();

  function updateIcons() {
    const isDark = document.body.classList.contains('dark');
    if (themeIcon) {
      themeIcon.className = isDark ? 'bx bx-sun' : 'bx bx-moon';
    }
    if (widgetIcon) {
      widgetIcon.className = isDark ? 'bx bx-sun' : 'bx bx-moon';
    }

    if (headerToggle) {
      headerToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    }
    if (widgetToggle) {
      widgetToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    }
  }

  function toggleTheme() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateIcons();
  }

  if (headerToggle) {
    headerToggle.addEventListener('click', () => toggleThemeAction());
  }
  if (widgetToggle) {
    widgetToggle.addEventListener('click', () => toggleThemeAction());
  }
}

export function toggleThemeAction(targetTheme = null) {
  const isCurrentlyDark = document.body.classList.contains('dark');
  let newTheme = isCurrentlyDark ? 'light' : 'dark';

  if (targetTheme === 'dark') newTheme = 'dark';
  else if (targetTheme === 'light') newTheme = 'light';

  if (newTheme === 'dark') {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }

  localStorage.setItem('theme', newTheme);

  const themeIcon = document.getElementById('theme-icon');
  const widgetIcon = document.getElementById('widget-theme-icon');
  const headerToggle = document.getElementById('darkModeToggle');
  const widgetToggle = document.querySelector('.widget-dark-toggle');

  const isDark = newTheme === 'dark';
  if (themeIcon) themeIcon.className = isDark ? 'bx bx-sun' : 'bx bx-moon';
  if (widgetIcon) widgetIcon.className = isDark ? 'bx bx-sun' : 'bx bx-moon';
  if (headerToggle) headerToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
  if (widgetToggle) widgetToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
}
