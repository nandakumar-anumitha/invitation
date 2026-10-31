(() => {
  const music = document.getElementById('background-music');
  const toggle = document.getElementById('music-toggle');
  const label = document.getElementById('music-label');
  const films = [...document.querySelectorAll('.film-player video')];
  let userPaused = false;
  let resumeAfterFilm = false;
  music.volume = 0.35;
  function update() {
    const playing = !music.paused;
    const tamil = document.documentElement.lang === 'ta';
    label.textContent = playing ? (tamil ? 'இசையை நிறுத்து' : 'Pause music') : (tamil ? 'இசையை இயக்கு' : 'Play music');
    toggle.setAttribute('aria-label', label.textContent);
    toggle.setAttribute('aria-pressed', String(playing));
  }
  async function play() {
    if (userPaused || films.some(film => !film.paused)) return;
    try { await music.play(); } catch { update(); }
  }
  toggle.addEventListener('click', () => {
    if (music.paused) { userPaused = false; play(); }
    else { userPaused = true; music.pause(); }
  });
  function firstInteraction(event) {
    if (toggle.contains(event.target)) return;
    play();
    document.removeEventListener('click', firstInteraction);
    document.removeEventListener('keydown', firstInteraction);
  }
  document.addEventListener('click', firstInteraction);
  document.addEventListener('keydown', firstInteraction);
  // Try once on each scrolling gesture; a tap fallback remains available
  // because browsers do not always grant audio activation for scrolling.
  const scrollPlayback = () => { play(); };
  window.addEventListener('wheel', scrollPlayback, {passive:true, once:true});
  window.addEventListener('touchmove', scrollPlayback, {passive:true, once:true});
  window.addEventListener('scroll', scrollPlayback, {passive:true, once:true});

  music.addEventListener('play', update);
  music.addEventListener('pause', update);
  new MutationObserver(update).observe(document.documentElement, {attributes:true, attributeFilter:['lang']});
  for (const film of films) {
    film.addEventListener('play', () => { resumeAfterFilm = resumeAfterFilm || !music.paused; music.pause(); films.forEach(other => { if (other !== film && !other.paused) other.pause(); }); });
    const resume = () => { if (films.some(item => !item.paused)) return; if (resumeAfterFilm && !userPaused) play(); resumeAfterFilm = false; };
    film.addEventListener('pause', resume);
    film.addEventListener('ended', resume);
  }
  update();
  play();
})();
