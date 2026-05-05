const form = (() => {
  let onChange = null;
  let timer    = null;

  const state = {
    tab:         'link',
    logoDataURL: null,
    logoSizePct: 0.25,
    size:        240,
  };

  function init(callback) {
    onChange = callback;

    ['link-data','pix-chave','pix-valor',
     'wifi-ssid','wifi-pass','qr-label'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', schedule);
    });

    document.getElementById('wifi-sec')?.addEventListener('change', schedule);

    document.getElementById('color-fg')?.addEventListener('input', () => syncColor('fg'));
    document.getElementById('color-bg')?.addEventListener('input', () => syncColor('bg'));
    document.getElementById('hex-fg')?.addEventListener('input',   () => syncHex('fg'));
    document.getElementById('hex-bg')?.addEventListener('input',   () => syncHex('bg'));

    document.getElementById('qr-size')?.addEventListener('input', onSize);
    document.getElementById('logo-size')?.addEventListener('input', onLogoSize);
    document.getElementById('logo-input')?.addEventListener('change', onLogoFile);
  }

  function values() {
    return {
      tab:  state.tab,
      link: document.getElementById('link-data')?.value.trim() ?? '',
      pix: {
        key:    document.getElementById('pix-chave')?.value.trim()  ?? '',
        amount: document.getElementById('pix-valor')?.value.trim()  ?? '',
      },
      wifi: {
        ssid:     document.getElementById('wifi-ssid')?.value.trim() ?? '',
        password: document.getElementById('wifi-pass')?.value.trim() ?? '',
        security: document.getElementById('wifi-sec')?.value         ?? 'WPA',
      },
      fg:          document.getElementById('color-fg')?.value ?? '#000000',
      bg:          document.getElementById('color-bg')?.value ?? '#ffffff',
      size:        state.size,
      logoDataURL: state.logoDataURL,
      logoSizePct: state.logoSizePct,
      label:       document.getElementById('qr-label')?.value.trim() ?? '',
    };
  }

  function switchTab(tab) {
    state.tab = tab;
    document.querySelectorAll('.tab').forEach((btn, i) =>
      btn.classList.toggle('active', ['link','pix','wifi'][i] === tab)
    );
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.getElementById('tab-' + tab)?.classList.add('active');
    schedule();
  }

  function removeLogo() {
    state.logoDataURL = null;
    document.getElementById('logo-input').value = '';
    document.getElementById('logo-name').style.display       = 'none';
    document.getElementById('remove-logo-btn').style.display = 'none';
    document.getElementById('logo-size-field').style.display = 'none';
    schedule();
  }

  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(() => onChange?.(), 180);
  }

  function syncColor(which) {
    document.getElementById('hex-' + which).value = document.getElementById('color-' + which).value;
    schedule();
  }

  function syncHex(which) {
    const v = document.getElementById('hex-' + which).value;
    if (/^#[0-9a-fA-F]{6}$/.test(v)) {
      document.getElementById('color-' + which).value = v;
      schedule();
    }
  }

  function onSize() {
    state.size = parseInt(document.getElementById('qr-size').value, 10);
    document.getElementById('size-val').textContent = state.size + 'px';
    schedule();
  }

  function onLogoSize() {
    state.logoSizePct = parseInt(document.getElementById('logo-size').value, 10) / 100;
    document.getElementById('logo-size-val').textContent = Math.round(state.logoSizePct * 100) + '%';
    if (state.logoDataURL) schedule();
  }

  function onLogoFile() {
    const file = document.getElementById('logo-input').files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      state.logoDataURL = e.target.result;
      document.getElementById('logo-name').style.display       = 'block';
      document.getElementById('logo-name').textContent         = file.name;
      document.getElementById('remove-logo-btn').style.display = 'block';
      document.getElementById('logo-size-field').style.display = 'flex';
      schedule();
    };
    reader.readAsDataURL(file);
  }

  return { init, values, switchTab, removeLogo };
})();
