// assets/js/copy-code.js - Modern Code Copy with Visual Feedback
document.addEventListener('DOMContentLoaded', function () {
  const codeWrappers = document.querySelectorAll('.code-block-wrapper');
  const copyIconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-copy"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
  const checkIconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="icon-check"><polyline points="20 6 9 17 4 12"></polyline></svg>';

  codeWrappers.forEach(function (wrapper) {
    const codeToCopy = wrapper.dataset.code;
    if (!codeToCopy) return;

    const targetHeader = wrapper.querySelector('.code-block-header') || wrapper.querySelector('div.highlight');
    if (!targetHeader) return;

    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-code-button';
    copyBtn.type = 'button';
    copyBtn.setAttribute('aria-label', 'Copy code to clipboard');
    copyBtn.innerHTML = copyIconSvg + '<span class="copy-text">Copy</span>';

    targetHeader.appendChild(copyBtn);

    copyBtn.addEventListener('click', function () {
      navigator.clipboard.writeText(codeToCopy).then(function () {
        copyBtn.innerHTML = checkIconSvg + '<span class="copy-text">Copied!</span>';
        copyBtn.classList.add('copied');

        setTimeout(function () {
          copyBtn.innerHTML = copyIconSvg + '<span class="copy-text">Copy</span>';
          copyBtn.classList.remove('copied');
        }, 2000);
      }).catch(function (err) {
        console.error('Failed to copy code: ', err);
        copyBtn.querySelector('.copy-text').textContent = 'Error';
      });
    });
  });
});
