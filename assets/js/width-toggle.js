// assets/js/width-toggle.js - Margin Gutter Width Toggle (Normal / Wide Mode)
document.addEventListener('DOMContentLoaded', function () {
  const toggleGutterElements = document.querySelectorAll('.margin-gutter, .width-toggle-btn');

  function toggleWidth() {
    document.documentElement.classList.toggle('wide-mode');
    const isWide = document.documentElement.classList.contains('wide-mode');
    localStorage.setItem('reader-width', isWide ? 'wide' : 'normal');
  }

  toggleGutterElements.forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleWidth();
    });
  });
});
