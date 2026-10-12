// жаба website: ribbit on arrival, screenshot tabs, cheat code.
(() => {
  const audio = document.getElementById('ribbit');
  const soundBtn = document.getElementById('sound-btn');
  let soundOn = true;
  try { soundOn = localStorage.getItem('zhaba-sound') !== 'off'; } catch {}
  const renderSound = () => { soundBtn.innerHTML = soundOn ? '&#9835; ON' : '&#9835; OFF'; };
  renderSound();

  const frog = document.getElementById('hero-frog');
  function ribbit() {
    frog.classList.remove('croak'); void frog.offsetWidth; frog.classList.add('croak');
    if (!soundOn) return Promise.resolve(false);
    audio.currentTime = 0;
    return audio.play().then(() => true).catch(() => false);
  }

  // Browsers block sound until the visitor interacts. Try on load, then on first gesture.
  let greeted = false;
  const greet = () => {
    if (greeted) return;
    ribbit().then((played) => { if (played) { greeted = true; cleanup(); } });
  };
  const events = ['pointerdown', 'keydown', 'touchstart'];
  const cleanup = () => events.forEach((e) => document.removeEventListener(e, greet, true));
  events.forEach((e) => document.addEventListener(e, greet, true));
  window.addEventListener('load', greet);

  frog.addEventListener('click', ribbit);
  document.getElementById('cta-main').addEventListener('click', ribbit);
  soundBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    soundOn = !soundOn;
    try { localStorage.setItem('zhaba-sound', soundOn ? 'on' : 'off'); } catch {}
    renderSound();
    if (soundOn) ribbit();
  });

  // Screenshot tabs
  const shot = document.getElementById('shot-main');
  document.querySelectorAll('.shot-tab').forEach((tab) => tab.addEventListener('click', () => {
    document.querySelectorAll('.shot-tab').forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    shot.src = `assets/shots/${tab.dataset.shot}.png`;
  }));

  // Konami code: it rains frogs.
  const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let pos = 0;
  document.addEventListener('keydown', (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    pos = key === code[pos] ? pos + 1 : (key === code[0] ? 1 : 0);
    if (pos === code.length) { pos = 0; frogRain(); }
  });
  function frogRain() {
    const box = document.getElementById('konami');
    const inner = box.querySelector('.konami-inner');
    box.classList.remove('hidden');
    for (let i = 0; i < 40; i++) {
      const img = document.createElement('img');
      img.src = 'assets/frog-64.png'; img.className = 'pix'; img.alt = '';
      img.style.left = `${Math.random() * 100}vw`;
      img.style.animationDuration = `${2 + Math.random() * 3}s`;
      img.style.animationDelay = `${Math.random() * 1.5}s`;
      inner.appendChild(img);
    }
    let n = 0; const t = setInterval(() => { ribbit(); if (++n >= 3) clearInterval(t); }, 450);
    setTimeout(() => { inner.innerHTML = ''; box.classList.add('hidden'); }, 7000);
  }
})();
