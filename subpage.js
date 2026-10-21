(() => {
  const reveals = document.querySelectorAll('.page-reveal');
  const typewriter = document.querySelector('.subpage-typewriter');
  if (!reveals.length && !typewriter) return;

  const showAll = () => reveals.forEach((item) => item.classList.add('is-visible'));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const startReveals = () => {
    if (!('IntersectionObserver' in window) || reducedMotion) {
      showAll();
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    reveals.forEach((item, index) => {
      item.style.setProperty('--reveal-delay', `${Math.min(index, 3) * 90}ms`);
      observer.observe(item);
    });
  };

  if (typewriter) {
    typewriter.classList.add('is-typed');
    window.setTimeout(startReveals, reducedMotion ? 0 : 1250);
  } else {
    startReveals();
  }
})();
