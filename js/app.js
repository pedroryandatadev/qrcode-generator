async function updateQR() {
  const v = form.values();

  let data = '';
  if (v.tab === 'link') data = payloads.link(v.link);
  if (v.tab === 'wifi') data = payloads.wifi(v.wifi.ssid, v.wifi.password, v.wifi.security);
  if (v.tab === 'pix')  data = payloads.pix(v.pix.key, v.pix.amount);

  if (!data) { preview.showEmpty(); return; }

  let canvas;
  try {
    canvas = await renderer.compose({
      data, fg: v.fg, bg: v.bg, size: v.size,
      logoDataURL: v.logoDataURL, logoSizePct: v.logoSizePct, label: v.label,
    });
  } catch {
    preview.showError();
    return;
  }

  preview.show(canvas);
  preview.updateMeta(v.tab, data.length, v.wifi.ssid);
}

function switchTab(tab)  { form.switchTab(tab); }
function removeLogo()    { form.removeLogo(); }

function downloadQR() {
  const canvas = preview.getCanvas();
  if (!canvas) { alert(i18n.t('err_generate')); return; }
  canvas.toBlob(blob => {
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob), download: 'qrcode.png'
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }, 'image/png');
}

document.addEventListener('DOMContentLoaded', () => {
  i18n.apply('en');
  langMenu.init(() => {
    const v = form.values();
    if (preview.getCanvas()) preview.updateMeta(v.tab, 0, v.wifi.ssid);
  });
  form.init(updateQR);
});
