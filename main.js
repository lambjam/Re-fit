(() => {
  const story = document.getElementById('story');
  const starField = document.getElementById('stars');
  const status = document.getElementById('status');

  for (let index = 0; index < 86; index += 1) {
    const star = document.createElement('i');
    star.className = 'star';
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 76}%`;
    star.style.width = star.style.height = `${Math.random() > .8 ? 3 : 2}px`;
    star.style.animationDelay = `${Math.random() * 4}s`;
    starField.appendChild(star);
  }

  let replayTimer;
  function playStory() {
    story.classList.remove('playing');
    void story.offsetWidth;
    story.classList.add('playing');
    status.textContent = 'A hanger is falling toward the clothes. Doggo is about to pop out!';
    clearTimeout(replayTimer);
    replayTimer = setTimeout(() => {
      status.textContent = 'Meet Doggo and Re-Fit.';
    }, 6100);
  }

  document.getElementById('replay').addEventListener('click', playStory);
  window.addEventListener('DOMContentLoaded', playStory, { once: true });
  if (document.readyState !== 'loading') playStory();
})();
