const stage = document.querySelector('#videoStage');
const play = document.querySelector('#playDemo');
const toast = document.querySelector('#toast');

play?.addEventListener('click', () => {
  stage.classList.remove('playing');
  void stage.offsetWidth;
  stage.classList.add('playing');
  play.setAttribute('aria-label', 'Demonstração em reprodução');
  window.setTimeout(() => {
    stage.classList.remove('playing');
    play.setAttribute('aria-label', 'Reproduzir demonstração novamente');
  }, 8000);
});

document.querySelectorAll('.checkout').forEach(link => {
  link.addEventListener('click', event => {
    if (link.getAttribute('href') === '#') {
      event.preventDefault();
      toast.textContent = `Plano ${link.dataset.plan}: adicione aqui o seu link de checkout.`;
      toast.classList.add('show');
      window.setTimeout(() => toast.classList.remove('show'), 3200);
    }
  });
});
