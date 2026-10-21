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

  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');
  const siteDrawer = document.getElementById('site-navigation');
  const navScrim = document.getElementById('nav-scrim');
  function setNavigationOpen(isOpen) {
    document.body.classList.toggle('nav-open', isOpen);
    navToggle?.setAttribute('aria-expanded', String(isOpen));
    siteDrawer?.setAttribute('aria-hidden', String(!isOpen));
    if (siteDrawer) siteDrawer.inert = !isOpen;
    if (isOpen) navClose?.focus();
    else navToggle?.focus();
  }
  navToggle?.addEventListener('click', () => setNavigationOpen(true));
  navClose?.addEventListener('click', () => setNavigationOpen(false));
  navScrim?.addEventListener('click', () => setNavigationOpen(false));
  document.querySelectorAll('[data-nav-link]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      setNavigationOpen(false);
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.classList.contains('nav-open')) {
      setNavigationOpen(false);
    }
  });

  const processFlow = document.querySelector('.process-flow');
  const solutionSection = document.getElementById('solution-section');
  processFlow?.addEventListener('click', (event) => {
    const card = event.target.closest('.flow-card');
    if (!card) return;
    card.classList.toggle('is-flipped');
    card.classList.add('is-seen');
    card.setAttribute('aria-pressed', String(card.classList.contains('is-flipped')));
    const cards = [...processFlow.querySelectorAll('.flow-card')];
    if (cards.length && cards.every((item) => item.classList.contains('is-seen'))) {
      const firstCompletion = !solutionSection?.classList.contains('all-cards-flipped');
      solutionSection?.classList.add('all-cards-flipped');
      const fifthCard = cards[4];
      if (firstCompletion && fifthCard?.classList.contains('is-seen')) {
        window.setTimeout(() => {
          document.querySelector('.insights-note')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 700);
      }
    }
  });

  const problemSection = document.getElementById('next-section');
  if (problemSection && 'IntersectionObserver' in window) {
    const problemSectionObserver = new IntersectionObserver(([entry]) => {
      problemSection.classList.toggle('is-entered', entry.isIntersecting);
    }, { threshold: 0.08 });
    problemSectionObserver.observe(problemSection);
  } else if (problemSection) {
    problemSection.classList.add('is-entered');
  }

  const keepScrolling = document.querySelector('.keep-scrolling');
  const nextSection = document.getElementById('solution-section');
  if (keepScrolling && nextSection && 'IntersectionObserver' in window) {
    const nextSectionObserver = new IntersectionObserver(([entry]) => {
      keepScrolling.classList.toggle('is-hidden', entry.isIntersecting);
      solutionSection?.classList.toggle('is-entered', entry.isIntersecting);
    }, { threshold: 0.01 });
    nextSectionObserver.observe(nextSection);
  } else {
    keepScrolling?.classList.add('is-hidden');
    document.getElementById('solution-section')?.classList.add('is-entered');
  }

  const visionSection = document.getElementById('vision-section');
  if (visionSection && 'IntersectionObserver' in window) {
    const visionSectionObserver = new IntersectionObserver(([entry]) => {
      visionSection.classList.toggle('is-entered', entry.isIntersecting);
    }, { threshold: 0.08 });
    visionSectionObserver.observe(visionSection);
  } else if (visionSection) {
    visionSection.classList.add('is-entered');
  }

  const journeySection = document.getElementById('journey-section');
  const journeyItems = journeySection ? [...journeySection.querySelectorAll('.journey-item')] : [];
  const queuedJourneyItems = new Set();
  let journeyReady = false;
  const revealJourneyItem = (item) => {
    if (item.classList.contains('is-marker-visible')) return;
    item.classList.add('is-marker-visible');
    window.setTimeout(() => item.classList.add('is-card-visible'), 210);
    window.setTimeout(() => item.classList.add('is-sticker-visible'), 720);
  };
  if (journeySection && 'IntersectionObserver' in window) {
    const journeySectionObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      journeySection.classList.add('is-entered');
      window.setTimeout(() => {
        journeyReady = true;
        queuedJourneyItems.forEach(revealJourneyItem);
        queuedJourneyItems.clear();
      }, 1880);
      journeySectionObserver.unobserve(journeySection);
    }, { threshold: 0.08 });
    journeySectionObserver.observe(journeySection);

    const journeyItemObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        if (journeyReady) revealJourneyItem(entry.target);
        else queuedJourneyItems.add(entry.target);
        journeyItemObserver.unobserve(entry.target);
      });
    }, { threshold: 0.28, rootMargin: '0px 0px -8% 0px' });
    journeyItems.forEach((item) => journeyItemObserver.observe(item));
  } else if (journeySection) {
    journeySection.classList.add('is-entered');
    journeyItems.forEach(revealJourneyItem);
  }

  window.addEventListener('DOMContentLoaded', playStory, { once: true });
  if (document.readyState !== 'loading') playStory();
})();
