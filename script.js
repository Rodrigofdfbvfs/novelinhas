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

const feedbackViewport = document.querySelector('#feedbackViewport');
const feedbackTrack = document.querySelector('#feedbackTrack');
const previousFeedback = document.querySelector('.carousel-prev');
const nextFeedback = document.querySelector('.carousel-next');

if (feedbackViewport && feedbackTrack) {
  const originalCards = [...feedbackTrack.children];
  originalCards.forEach(card => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelector('img')?.setAttribute('alt', '');
    feedbackTrack.appendChild(clone);
  });

  let paused = false;
  let resumeTimer;
  let previousTime = performance.now();

  const cardStep = () => {
    const card = feedbackTrack.querySelector('figure');
    if (!card) return feedbackViewport.clientWidth;
    const styles = getComputedStyle(feedbackTrack);
    return card.getBoundingClientRect().width + parseFloat(styles.gap || 0);
  };

  const pauseTemporarily = () => {
    paused = true;
    window.clearTimeout(resumeTimer);
    resumeTimer = window.setTimeout(() => { paused = false; }, 4500);
  };

  const move = direction => {
    pauseTemporarily();
    feedbackViewport.scrollBy({ left: cardStep() * direction, behavior: 'smooth' });
  };

  previousFeedback?.addEventListener('click', () => move(-1));
  nextFeedback?.addEventListener('click', () => move(1));
  feedbackViewport.addEventListener('pointerdown', pauseTemporarily);
  feedbackViewport.addEventListener('mouseenter', () => { paused = true; });
  feedbackViewport.addEventListener('mouseleave', () => { paused = false; });
  feedbackViewport.addEventListener('focusin', () => { paused = true; });
  feedbackViewport.addEventListener('focusout', () => { paused = false; });

  const autoplay = time => {
    const elapsed = Math.min(time - previousTime, 32);
    previousTime = time;
    if (!paused && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      feedbackViewport.scrollLeft += elapsed * 0.018;
      const halfway = feedbackTrack.scrollWidth / 2;
      if (feedbackViewport.scrollLeft >= halfway) feedbackViewport.scrollLeft -= halfway;
    }
    window.requestAnimationFrame(autoplay);
  };

  window.requestAnimationFrame(autoplay);
}
