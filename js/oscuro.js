// oscuro.js


  const toggleButton = document.getElementById('darkModeToggle');
  const themeIcon = document.getElementById('theme-icon');
  const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Guardar modo en localStorage
  const currentTheme = localStorage.getItem('theme') || (userPrefersDark ? 'dark' : 'light');
  if (currentTheme === 'dark') {
    document.body.classList.add('dark');
    themeIcon.classList.replace('bx-moon', 'bx-sun');
  }

  toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeIcon.classList.toggle('bx-moon');
    themeIcon.classList.toggle('bx-sun');
  });

