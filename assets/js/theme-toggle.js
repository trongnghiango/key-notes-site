// assets/js/theme-toggle.js - Theme Toggle with localStorage persistence
document.addEventListener('DOMContentLoaded', function () {
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      document.documentElement.classList.toggle('dark');
      const isDark = document.documentElement.classList.contains('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }
});
