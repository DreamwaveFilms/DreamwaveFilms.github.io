(() => {
  const scene = document.querySelector('.cinema-scene');
  const toggle = document.getElementById('motion-toggle');
  if (!scene) return;
  // Same Israeli premiere instant as the existing countdown. Growth is date-based,
  // not visit-based: refreshing the page never resets the opening.
  const start = Date.parse('2026-10-12T00:00:00+03:00');
  const release = Date.parse('2027-01-04T18:00:00+02:00');
  function updateRift() {
    const progress = Math.max(0, Math.min(1, (Date.now() - start) / (release - start)));
    const growth = progress * progress * (3 - 2 * progress);
    scene.style.setProperty('--rift-width', (.16 + .84 * growth).toFixed(4));
    scene.style.setProperty('--rift-height', (.68 + .32 * growth).toFixed(4));
    scene.style.setProperty('--rift-opacity', (.5 + .25 * growth).toFixed(4));
  }
  updateRift();
  setInterval(() => { if (!document.hidden) updateRift(); }, 60000);
  let paused = false;
  try { paused = localStorage.getItem('dreamwave-motion-paused') === 'true'; } catch (_) {}
  function updateMotion() {
    document.documentElement.classList.toggle('motion-paused', paused || document.hidden);
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(paused));
      toggle.textContent = paused ? 'הפעלת אנימציה' : 'השהיית אנימציה';
    }
  }
  if (toggle) {
    toggle.hidden = false;
    toggle.addEventListener('click', () => {
      paused = !paused;
      try { localStorage.setItem('dreamwave-motion-paused', String(paused)); } catch (_) {}
      updateMotion();
    });
  }
  document.addEventListener('visibilitychange', () => { updateMotion(); if (!document.hidden) updateRift(); });
  updateMotion();
})();
