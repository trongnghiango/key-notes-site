// static/js/theme-toggle.js

document.addEventListener('DOMContentLoaded', function () {
  const themeToggle = document.getElementById('theme-toggle');

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      // Lật/đảo trạng thái class 'dark' trên thẻ <html>
      document.documentElement.classList.toggle('dark');

      // Kiểm tra xem class 'dark' có đang tồn tại hay không
      const isDark = document.documentElement.classList.contains('dark');
      
      // Lưu lựa chọn mới vào bộ nhớ của trình duyệt
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }
});
