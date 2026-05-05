const i18n = (() => {
  const map = Object.fromEntries(languages.map(l => [l.code, l.strings]));
  let current = 'pt';

  function t(key) {
    return map[current]?.[key] ?? key;
  }

  function apply(code) {
    if (!map[code]) return;
    current = code;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const v = map[code][el.dataset.i18n];
      if (v !== undefined) el.textContent = v;
    });

    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const v = map[code][el.dataset.i18nPh];
      if (v !== undefined) el.placeholder = v;
    });

    document.querySelectorAll('option[data-i18n]').forEach(el => {
      const v = map[code][el.dataset.i18n];
      if (v !== undefined) el.textContent = v;
    });

    document.documentElement.lang = code === 'pt' ? 'pt-BR' : code;

    const label = document.getElementById('lang-label');
    if (label) label.textContent = languages.find(l => l.code === code).label;
  }

  function getCurrent() { return current; }
  function getAll()     { return languages; }

  return { t, apply, getCurrent, getAll };
})();
