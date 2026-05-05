const preview = (() => {
  let masterCanvas = null;

  function getCanvas() { return masterCanvas; }

  function show(canvas) {
    masterCanvas = canvas;
    const container = document.getElementById('qr-container');
    const wrap      = document.getElementById('qr-canvas-wrap');

    wrap.classList.remove('is-empty');
    wrap.style.background = canvas._bg ?? '';

    const el = document.createElement('canvas');
    el.width  = canvas.width;
    el.height = canvas.height;
    el.style.cssText = 'display:block;border-radius:8px;';
    el.getContext('2d').drawImage(canvas, 0, 0);

    container.innerHTML = '';
    container.appendChild(el);
  }

  function showEmpty() {
    masterCanvas = null;
    const wrap = document.getElementById('qr-canvas-wrap');
    wrap.classList.add('is-empty');
    wrap.style.background = '';
    document.getElementById('qr-container').innerHTML =
      `<div class="empty-qr"><p data-i18n="empty_state">${i18n.t('empty_state')}</p></div>`;
    document.getElementById('preview-meta').textContent = '—';
  }

  function showError() {
    masterCanvas = null;
    const wrap = document.getElementById('qr-canvas-wrap');
    wrap.classList.add('is-empty');
    document.getElementById('qr-container').innerHTML =
      `<div class="empty-qr"><p>${i18n.t('err_qr')}</p></div>`;
  }

  function updateMeta(type, dataLength, ssid) {
    const map = {
      link: `${i18n.t('meta_link')} — ${dataLength} ${i18n.t('meta_chars')}`,
      pix:  `${i18n.t('meta_pix')} — ${dataLength} ${i18n.t('meta_chars')}`,
      wifi: `Wi-Fi — ${ssid}`,
    };
    document.getElementById('preview-meta').textContent = map[type] ?? '—';
  }

  return { getCanvas, show, showEmpty, showError, updateMeta };
})();
