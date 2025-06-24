// static/js/copy-code.js

document.addEventListener('DOMContentLoaded', function () {
  // Tìm tất cả các khối mã được bọc bởi render hook của chúng ta
  const codeBlocks = document.querySelectorAll('.code-block-wrapper');

  codeBlocks.forEach(function (block) {
    // Lấy ra div.highlight bên trong mà Hugo đã tạo
    const highlightDiv = block.querySelector('div.highlight');
    if (!highlightDiv) return;

    // Lấy code sạch từ "hộp bí mật" data-code
    const codeToCopy = block.dataset.code;

    // Tạo nút copy
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-code-button';
    copyButton.type = 'button';
    copyButton.ariaLabel = 'Copy code to clipboard';
    copyButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-copy"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
      <span class="copy-text">Copy</span>
    `;

    // Thêm nút vào khối highlight
    highlightDiv.appendChild(copyButton);

    // Thêm sự kiện click
    copyButton.addEventListener('click', function () {
      navigator.clipboard.writeText(codeToCopy).then(function () {
        // Phản hồi thành công
        copyButton.querySelector('.copy-text').textContent = 'Copied!';
        copyButton.classList.add('copied');
        
        // Trở lại trạng thái cũ sau 2 giây
        setTimeout(function () {
          copyButton.querySelector('.copy-text').textContent = 'Copy';
          copyButton.classList.remove('copied');
        }, 2000);
      }).catch(function (err) {
        console.error('Failed to copy code: ', err);
        copyButton.querySelector('.copy-text').textContent = 'Error';
      });
    });
  });
});
