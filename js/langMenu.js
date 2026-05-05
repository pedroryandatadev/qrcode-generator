const langMenu = (() => {
  let onSelect = null;

  function init(callback) {
    onSelect = callback;
    document.getElementById('lang-btn').addEventListener('click', toggle);
    document.addEventListener('click', e => {
      if (!document.getElementById('lang-dropdown').contains(e.target)) close();
    });
    render();
  }

  function render() {
    const menu    = document.getElementById('lang-menu');
    const current = i18n.getCurrent();
    menu.innerHTML = '';

    i18n.getAll().forEach(lang => {
      const btn = document.createElement('button');
      btn.className = 'lang-option' + (lang.code === current ? ' active' : '');
      btn.innerHTML = `
        <span class="lang-flag">${lang.flag}</span>
        <span class="lang-opt-name">${lang.label}</span>
        <span class="lang-opt-code">${lang.code.toUpperCase()}</span>
        <span class="lang-opt-check"></span>
      `;
      btn.addEventListener('click', () => select(lang.code));
      menu.appendChild(btn);
    });
  }

  function toggle(e) {
    e.stopPropagation();
    document.getElementById('lang-dropdown').classList.toggle('open');
  }

  function close() {
    document.getElementById('lang-dropdown').classList.remove('open');
  }

  function select(code) {
    close();
    i18n.apply(code);
    render();
    if (onSelect) onSelect(code);
  }

  return { init };
})();
