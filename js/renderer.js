const renderer = (() => {
  const PAD = 20;

  function generateRaw(data, fg, bg, size) {
    return new Promise((resolve, reject) => {
      const tmp = document.createElement('div');
      tmp.style.cssText = 'position:absolute;left:-9999px;top:-9999px;';
      document.body.appendChild(tmp);

      try {
        new QRCode(tmp, { text: data, width: size, height: size, colorDark: fg, colorLight: bg, correctLevel: QRCode.CorrectLevel.H });
      } catch(e) {
        document.body.removeChild(tmp);
        return reject(e);
      }

      const poll = (tries) => {
        const canvas = tmp.querySelector('canvas');
        if (canvas) { document.body.removeChild(tmp); return resolve(canvas); }

        const img = tmp.querySelector('img');
        if (img && img.complete && img.naturalWidth > 0) {
          const c = document.createElement('canvas');
          c.width = size; c.height = size;
          c.getContext('2d').drawImage(img, 0, 0, size, size);
          document.body.removeChild(tmp);
          return resolve(c);
        }

        if (tries <= 0) { document.body.removeChild(tmp); return reject(new Error('timeout')); }
        setTimeout(() => poll(tries - 1), 50);
      };

      setTimeout(() => poll(20), 50);
    });
  }

  async function compose({ data, fg, bg, size, logoDataURL, logoSizePct, label }) {
    const raw       = await generateRaw(data, fg, bg, size);
    const fontSize  = Math.round(size * 0.055);
    const lblHeight = label ? Math.round(fontSize * 2.2) : 0;

    const out = document.createElement('canvas');
    out.width  = raw.width  + PAD * 2;
    out.height = raw.height + PAD * 2 + lblHeight;

    const ctx = out.getContext('2d');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, out.width, out.height);
    ctx.drawImage(raw, PAD, PAD);

    if (logoDataURL) {
      await new Promise(res => {
        const img = new Image();
        img.onload = () => {
          const s  = Math.floor(raw.width * logoSizePct);
          const lx = PAD + Math.floor((raw.width  - s) / 2);
          const ly = PAD + Math.floor((raw.height - s) / 2);
          ctx.fillStyle = bg;
          ctx.fillRect(lx - 4, ly - 4, s + 8, s + 8);
          ctx.drawImage(img, lx, ly, s, s);
          res();
        };
        img.onerror = res;
        img.src = logoDataURL;
      });
    }

    if (label) {
      ctx.font         = `500 ${fontSize}px ui-monospace, 'Courier New', monospace`;
      ctx.fillStyle    = fg;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, out.width / 2, PAD * 2 + raw.height + lblHeight / 2);
    }

    return out;
  }

  return { compose };
})();
