// lancé par le test « local » de NeoDex : vérification interne, puis finit un niveau avec les indices (Tab) et regarde le bilan
module.exports = async ({ pj, sleep }) => {
  const key = k => pj(`document.dispatchEvent(new KeyboardEvent('keydown', {key: '${k}', bubbles: true})), 0`);
  const label = () => pj(`document.getElementById('anCanvas').getAttribute('aria-label')`);
  const sc = await pj(`document.querySelector('[data-selfcheck]')?.dataset.selfcheck`); if (sc !== 'ok') throw new Error('vérification interne : ' + sc);
  await sleep(400); await key('Enter'); await sleep(200);
  for (let i = 0; i < 5 * 9; i++) { await key('Tab'); await sleep(40); }
  await sleep(800);
  const l = await label();
  if (!/niveau fini/.test(l)) throw new Error('le niveau devait être fini : « ' + l + ' »');
  return l;
};
