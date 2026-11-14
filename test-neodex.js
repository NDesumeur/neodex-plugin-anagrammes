// lancé par le test « local » de NeoDex : vérification interne, un mot trouvé à la main (définition affichée), le reste du niveau aux indices (Tab), le bilan, la mise en page et le plein écran
module.exports = async ({ pj, sleep }) => {
  const key = k => pj(`document.dispatchEvent(new KeyboardEvent('keydown', {key: '${k}', bubbles: true})), 0`);
  const label = () => pj(`document.getElementById('anCanvas').getAttribute('aria-label')`);
  const shot = async name => { const dir = process.env.NEO_SHOTS; if (!dir) return; const d = await pj(`document.getElementById('anCanvas').toDataURL()`); require('fs').writeFileSync(require('path').join(dir, 'anagrammes-' + name + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  const sc = await pj(`document.querySelector('[data-selfcheck]')?.dataset.selfcheck`); if (sc !== 'ok') throw new Error('vérification interne : ' + sc);
  await sleep(400); await key('Enter'); await sleep(200);
  const word = await pj(`document.getElementById('anCanvas').__an().word`);
  for (const c of word) { await key(c); await sleep(60); }
  await sleep(300); await shot('trouve');
  if (!/mot trouvé/.test(await label())) throw new Error('le mot devait être trouvé : « ' + await label() + ' »');
  const side = await pj(`document.getElementById('anFound').textContent`);
  if (!side.includes(word) || side.length < word.length + 5) throw new Error('colonne des mots sans définition : « ' + side + ' »');
  for (let i = 0; i < 5 * 10; i++) { await key('Tab'); await sleep(40); }
  await sleep(1400); await shot('bilan');
  const l = await label();
  if (!/niveau fini, [123] étoiles/.test(l)) throw new Error('le niveau devait être fini : « ' + l + ' »');
  const n = await pj(`document.querySelectorAll('#anFound .anW').length`); if (n !== 5) throw new Error(n + ' mots dans la colonne au lieu de 5');
  const lay = await pj(`(() => { const c = document.getElementById('anCanvas').getBoundingClientRect(), s = document.querySelector('.gSide').getBoundingClientRect(); return { beside: s.left >= c.right - 1, fits: c.right <= innerWidth + 1 && document.documentElement.scrollWidth <= innerWidth + 1, w: innerWidth }; })()`);
  if (!lay.fits || (lay.w >= 700 && !lay.beside)) throw new Error('mise en page : ' + JSON.stringify(lay));
  await pj(`document.getElementById('anFs').click(), 0`); await sleep(700);
  const fs = await pj(`(() => { const c = document.getElementById('anCanvas'); return document.fullscreenElement === c.parentElement && Math.abs(c.getBoundingClientRect().height - innerHeight) < 3; })()`);
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(300);
  if (!fs) throw new Error('le plein écran ne remplit pas la hauteur');
  { // la zone de jeu tient dans la fenêtre, quelle que soit sa taille
    const L = await pj(`(() => { const c = [...document.querySelectorAll('.gameBox canvas')].filter(c => c.offsetWidth).sort((a, b) => b.offsetWidth - a.offsetWidth)[0], r = c.getBoundingClientRect(); let s = 0; for (let e = c.parentElement; e; e = e.parentElement) s += e.scrollTop; return { top: Math.round(r.top + s), bottom: Math.round(r.bottom + s), h: Math.round(r.height), w: Math.round(r.width), wh: innerHeight, ww: innerWidth, sw: document.documentElement.scrollWidth }; })()`);
    if (process.env.NEO_FIT_LOG) console.log('FIT', JSON.stringify(L));
    if (L.bottom > L.wh + 1 || L.sw > L.ww + 1) throw new Error('la zone de jeu dépasse la fenêtre : ' + JSON.stringify(L));
  }
  return l + ' · fenêtre ' + lay.w + ' px';
};
