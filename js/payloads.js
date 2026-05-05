const payloads = (() => {

  function link(url) {
    return url.trim();
  }

  function wifi(ssid, password, security) {
    if (!ssid.trim()) return '';
    return `WIFI:T:${security};S:${ssid.trim()};P:${password.trim()};;`;
  }

  function pix(key, amount) {
    const chave = key.trim();
    if (!chave) return '';

    const valor = parseFloat(amount) > 0 ? parseFloat(amount).toFixed(2) : null;

    const f = (id, v) => `${id}${String(v.length).padStart(2,'0')}${v}`;

    const merchant = f('00', 'BR.GOV.BCB.PIX') + f('01', chave);

    let p = '';
    p += f('00', '01');   // Payload Format Indicator
    p += f('01', '11');   // Point of Initiation Method: 11 = QR static, payment immediately.
    p += f('26', merchant);
    p += f('52', '0000'); // Merchant Category Code
    p += f('53', '986');  // Transaction Currency: 986 = BRL
    if (valor) p += f('54', valor);
    p += f('58', 'BR');
    p += f('59', 'RECEBEDOR');
    p += f('60', 'BRASIL');
    p += f('62', f('05', '***')); // Reference Label — mandatory BR Code
    p += '6304';

    return p + crc16(p);
  }

  function crc16(data) {
    let crc = 0xFFFF;
    for (const b of new TextEncoder().encode(data)) {
      crc ^= b << 8;
      for (let i = 0; i < 8; i++) {
        crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1;
        crc &= 0xFFFF;
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
  }

  return { link, wifi, pix };
})();
