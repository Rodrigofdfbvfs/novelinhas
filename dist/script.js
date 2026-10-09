const offerDate = document.querySelector('#offerDate');

function updateOfferDate() {
  if (!offerDate) return;
  const now = new Date();
  offerDate.dateTime = now.toISOString().slice(0, 10);
  offerDate.textContent = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(now);
}

updateOfferDate();
window.setInterval(updateOfferDate, 60000);

function initInfiniteCarousel({ viewport, track, previous, next, speed }) {
  if (!viewport || !track) return;

  const originalCards = [...track.children];
  originalCards.forEach(card => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelector('img')?.setAttribute('alt', '');
    track.appendChild(clone);
  });

  let paused = false;
  let resumeTimer;
  let previousTime = performance.now();

  const cardStep = () => {
    const card = track.querySelector('figure');
    if (!card) return viewport.clientWidth;
    const styles = getComputedStyle(track);
    return card.getBoundingClientRect().width + parseFloat(styles.gap || 0);
  };

  const pauseTemporarily = () => {
    paused = true;
    window.clearTimeout(resumeTimer);
    resumeTimer = window.setTimeout(() => { paused = false; }, 4500);
  };

  const move = direction => {
    pauseTemporarily();
    viewport.scrollBy({ left: cardStep() * direction, behavior: 'smooth' });
  };

  previous?.addEventListener('click', () => move(-1));
  next?.addEventListener('click', () => move(1));
  viewport.addEventListener('pointerdown', pauseTemporarily);
  viewport.addEventListener('mouseenter', () => { paused = true; });
  viewport.addEventListener('mouseleave', () => { paused = false; });
  viewport.addEventListener('focusin', () => { paused = true; });
  viewport.addEventListener('focusout', () => { paused = false; });

  const autoplay = time => {
    const elapsed = Math.min(time - previousTime, 32);
    previousTime = time;
    if (!paused && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      viewport.scrollLeft += elapsed * speed;
      const halfway = track.scrollWidth / 2;
      if (viewport.scrollLeft >= halfway) viewport.scrollLeft -= halfway;
    }
    window.requestAnimationFrame(autoplay);
  };

  window.requestAnimationFrame(autoplay);
}

initInfiniteCarousel({
  viewport: document.querySelector('#feedbackViewport'),
  track: document.querySelector('#feedbackTrack'),
  previous: document.querySelector('.carousel-prev'),
  next: document.querySelector('.carousel-next'),
  speed: 0.018
});

initInfiniteCarousel({
  viewport: document.querySelector('#appPreviewViewport'),
  track: document.querySelector('#appPreviewTrack'),
  previous: document.querySelector('.app-carousel-prev'),
  next: document.querySelector('.app-carousel-next'),
  speed: 0.012
});
