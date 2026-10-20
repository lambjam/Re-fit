/**
 * Re-fit — Homepage Landing Screen Logic & Animation Controller
 * Orchestrates the falling hanger, clothes pile impact, doggo pop-out, and brand reveal.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const starsContainer = document.getElementById('starsContainer');
  const fallingHanger = document.getElementById('fallingHanger');
  const impactBurst = document.getElementById('impactBurst');
  const clothesPile = document.getElementById('clothesPile');
  const doggoContainer = document.getElementById('doggoContainer');
  const landedHangerInPile = document.getElementById('landedHangerInPile');
  const titleBox = document.getElementById('titleBox');
  const doggoBubble = document.getElementById('doggoBubble');
  const bubbleText = document.getElementById('bubbleText');
  const animationStatusText = document.getElementById('animationStatusText');

  // Trigger buttons
  const navReplayBtn = document.getElementById('navReplayBtn');
  const heroReplayTrigger = document.getElementById('heroReplayTrigger');
  const stripReplayBtn = document.getElementById('stripReplayBtn');
  const petDoggoBtn = document.getElementById('petDoggoBtn');
  const petSproutSectionBtn = document.getElementById('petSproutSectionBtn');
  const viewReferenceBtn = document.getElementById('viewReferenceBtn');
  const referenceModal = document.getElementById('referenceModal');
  const closeModalBtn = document.getElementById('closeModalBtn');

  // Audio elements
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundOnIcon = document.getElementById('soundOnIcon');
  const soundOffIcon = document.getElementById('soundOffIcon');
  const soundLabel = document.getElementById('soundLabel');

  let soundEnabled = false;
  let audioCtx = null;
  let isAnimating = false;

  // ==========================================================================
  // 1. Starfield Generator (Navy Sky with Small White Stars)
  // ==========================================================================
  function createStarrySky() {
    if (!starsContainer) return;
    starsContainer.innerHTML = '';
    const starCount = 85;

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';

      const x = Math.random() * 100;
      const y = Math.random() * 95; // mostly in upper 95% of sky container
      const size = Math.random() < 0.65 ? 1.5 : (Math.random() < 0.85 ? 2.5 : 3.5);
      const duration = 2 + Math.random() * 3.5;
      const delay = Math.random() * 4;

      star.style.left = `${x}%`;
      star.style.top = `${y}%`;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.setProperty('--twinkle-dur', `${duration}s`);
      star.style.animationDelay = `${delay}s`;

      starsContainer.appendChild(star);
    }
  }

  createStarrySky();

  // ==========================================================================
  // 2. Web Audio Synthesizer (Zero-Dependency Sound Effects)
  // ==========================================================================
  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playFallingChime() {
    if (!soundEnabled || !audioCtx) return;
    const now = audioCtx.currentTime;

    // Gentle descending flute-like sweep
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';

    osc.frequency.setValueAtTime(650, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 2.2);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.3);
    gain.gain.linearRampToValueAtTime(0.01, now + 2.2);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 2.2);
  }

  function playImpactThump() {
    if (!soundEnabled || !audioCtx) return;
    const now = audioCtx.currentTime;

    // Low gentle fabric thump
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';

    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.25);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  function playDoggoPop() {
    if (!soundEnabled || !audioCtx) return;
    const now = audioCtx.currentTime;

    // High cheerful pop + harmonic
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';

    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(680, now + 0.15);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.25);

    // Followed by a friendly playful chirp
    setTimeout(() => {
      if (!audioCtx) return;
      const t = audioCtx.currentTime;
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(520, t);
      osc2.frequency.setValueAtTime(660, t + 0.08);

      gain2.gain.setValueAtTime(0.15, t);
      gain2.gain.linearRampToValueAtTime(0.01, t + 0.2);

      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start(t);
      osc2.stop(t + 0.2);
    }, 180);
  }

  function playLogoChord() {
    if (!soundEnabled || !audioCtx) return;
    const now = audioCtx.currentTime;
    const notes = [330, 415, 495, 660]; // E major harmonic chord

    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0.01, now + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.06 + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now + idx * 0.06);
      osc.stop(now + 1.8);
    });
  }

  function playDoggoBark() {
    initAudio();
    if (!soundEnabled || !audioCtx) return;
    const now = audioCtx.currentTime;

    // Friendly playful yip
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';

    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(750, now + 0.07);
    osc.frequency.exponentialRampToValueAtTime(380, now + 0.16);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  // Toggle Sound Control
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      initAudio();
      soundEnabled = !soundEnabled;
      if (soundEnabled) {
        soundOnIcon.style.display = 'block';
        soundOffIcon.style.display = 'none';
        soundLabel.textContent = 'Sound On';
        playDoggoPop();
      } else {
        soundOnIcon.style.display = 'none';
        soundOffIcon.style.display = 'block';
        soundLabel.textContent = 'Sound Off';
      }
    });
  }

  // ==========================================================================
  // 3. Main Story Animation Controller
  // ==========================================================================
  function runStoryAnimation() {
    if (isAnimating) return;
    isAnimating = true;

    // Reset Elements
    titleBox.classList.remove('revealed');
    doggoContainer.classList.remove('popped-out', 'petting');
    clothesPile.classList.remove('squished');
    impactBurst.classList.remove('popped');
    landedHangerInPile.style.opacity = '0';
    fallingHanger.classList.remove('animating');
    doggoBubble.classList.remove('active');

    // Force reflow
    void fallingHanger.offsetWidth;

    if (animationStatusText) {
      animationStatusText.textContent = 'A hanger is drifting down from the starry sky...';
    }

    // Step 1: Start Falling Hanger (0s)
    fallingHanger.classList.add('animating');
    playFallingChime();

    // Step 2: Hanger impacts clothes pile (~2.35s)
    setTimeout(() => {
      playImpactThump();
      clothesPile.classList.add('squished');
      impactBurst.classList.add('popped');
      landedHangerInPile.style.opacity = '1';

      if (animationStatusText) {
        animationStatusText.textContent = 'Hanger landed into the cozy clothes pile!';
      }
    }, 2350);

    // Step 3: Doggo pops out of the clothes pile! (~2.5s)
    setTimeout(() => {
      playDoggoPop();
      doggoContainer.classList.add('popped-out');

      if (animationStatusText) {
        animationStatusText.textContent = 'Look! Sprout the doggo popped out! 🐾';
      }

      // Show friendly welcome speech bubble
      showBubble('Yip! Welcome to Re-fit! 🐾', 2800);
    }, 2550);

    // Step 4: Reveal "Meet re-fit" Brand Title (~3.4s)
    setTimeout(() => {
      playLogoChord();
      titleBox.classList.add('revealed');

      if (animationStatusText) {
        animationStatusText.textContent = '✨ Meet Re-fit — Sustainable Fashion Given a Second Life';
      }
      isAnimating = false;
    }, 3400);
  }

  // ==========================================================================
  // 4. Mascot Interactivity (Petting, Barking, Speech Bubble)
  // ==========================================================================
  const doggoMessages = [
    'Yip! Thank you for the pet! 🐾',
    '85% of textiles can be re-worn! 🌿',
    'I love cozy cream sweaters! 🧶',
    'Every garment donated brings a smile! 💚',
    'Drop off your clothes at any green box! 📦',
    'Wagging my tail for circular fashion! ✨'
  ];
  let msgIndex = 0;
  let bubbleTimeout = null;

  function showBubble(text, duration = 3000) {
    if (!doggoBubble || !bubbleText) return;
    bubbleText.textContent = text;
    doggoBubble.classList.add('active');

    if (bubbleTimeout) clearTimeout(bubbleTimeout);
    bubbleTimeout = setTimeout(() => {
      doggoBubble.classList.remove('active');
    }, duration);
  }

  function interactWithDoggo() {
    if (!doggoContainer.classList.contains('popped-out')) {
      // If doggo hasn't popped out yet, trigger the animation!
      runStoryAnimation();
      return;
    }

    doggoContainer.classList.remove('petting');
    void doggoContainer.offsetWidth;
    doggoContainer.classList.add('petting');

    playDoggoBark();

    const nextMsg = doggoMessages[msgIndex % doggoMessages.length];
    msgIndex++;
    showBubble(nextMsg, 3200);
  }

  if (doggoContainer) {
    doggoContainer.addEventListener('click', interactWithDoggo);
    doggoContainer.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        interactWithDoggo();
      }
    });
  }

  if (petDoggoBtn) {
    petDoggoBtn.addEventListener('click', interactWithDoggo);
  }

  if (petSproutSectionBtn) {
    petSproutSectionBtn.addEventListener('click', () => {
      interactWithDoggo();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Replay Trigger Buttons
  [navReplayBtn, heroReplayTrigger, stripReplayBtn].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(runStoryAnimation, 250);
      });
    }
  });

  // Reference Artwork Modal
  if (viewReferenceBtn && referenceModal && closeModalBtn) {
    viewReferenceBtn.addEventListener('click', () => {
      referenceModal.style.display = 'flex';
    });

    closeModalBtn.addEventListener('click', () => {
      referenceModal.style.display = 'none';
    });

    referenceModal.addEventListener('click', (e) => {
      if (e.target === referenceModal) {
        referenceModal.style.display = 'none';
      }
    });
  }

  // ==========================================================================
  // 5. Drop Box Search Simulation
  // ==========================================================================
  const mockBoxes = [
    { name: 'Prospect Park Eco-Hub Box', addr: '95 Prospect Park West, Brooklyn, NY', dist: '0.4 mi', hours: 'Open 24/7' },
    { name: 'Williamsburg Green Market Box', addr: '180 Bedford Ave, Brooklyn, NY', dist: '1.2 mi', hours: 'Open 24/7' },
    { name: 'DUMBO Community Center Drop', addr: '45 Washington St, Brooklyn, NY', dist: '2.1 mi', hours: 'Mon–Sat: 8am–9pm' },
    { name: 'SoHo Ethical Fashion Collective', addr: '512 Broadway, New York, NY', dist: '3.4 mi', hours: 'Open 24/7' },
    { name: 'Austin South Congress Box', addr: '1400 S Congress Ave, Austin, TX', dist: 'Local Hub', hours: 'Open 24/7' },
    { name: 'Seattle Fremont Eco-Station', addr: '3401 Evanston Ave N, Seattle, WA', dist: 'Local Hub', hours: 'Open 24/7' }
  ];

  const searchBoxesBtn = document.getElementById('searchBoxesBtn');
  const postalInput = document.getElementById('postalInput');
  const boxesList = document.getElementById('boxesList');

  function renderDropBoxes(query = '') {
    if (!boxesList) return;
    boxesList.innerHTML = '';

    const filtered = query.trim()
      ? mockBoxes.filter(b => b.name.toLowerCase().includes(query.toLowerCase()) || b.addr.toLowerCase().includes(query.toLowerCase()))
      : mockBoxes.slice(0, 3);

    if (filtered.length === 0) {
      boxesList.innerHTML = `
        <div class="box-item">
          <div class="box-info">
            <h4>No boxes found nearby yet</h4>
            <p>We're expanding fast! Request a free mail-in donation kit instead.</p>
          </div>
          <button class="btn-primary" style="padding:6px 14px; font-size:0.85rem;" onclick="alert('Free kit requested!')">Request Kit</button>
        </div>
      `;
      return;
    }

    filtered.forEach(box => {
      const item = document.createElement('div');
      item.className = 'box-item';
      item.innerHTML = `
        <div class="box-info">
          <h4>${box.name}</h4>
          <p>${box.addr} • <span style="color:#52774a; font-weight:600;">${box.hours}</span></p>
        </div>
        <div class="box-distance">${box.dist}</div>
      `;
      boxesList.appendChild(item);
    });
  }

  if (searchBoxesBtn && postalInput) {
    searchBoxesBtn.addEventListener('click', () => {
      renderDropBoxes(postalInput.value);
    });
    postalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        renderDropBoxes(postalInput.value);
      }
    });
    renderDropBoxes();
  }

  // ==========================================================================
  // 6. Impact Counter Animation
  // ==========================================================================
  function animateCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(el => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      if (isNaN(target)) return;

      let current = 0;
      const duration = 1800;
      const stepTime = 25;
      const totalSteps = duration / stepTime;
      const increment = target / totalSteps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          el.textContent = target.toLocaleString();
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(current).toLocaleString();
        }
      }, stepTime);
    });
  }

  // Trigger counters with IntersectionObserver
  const impactSection = document.getElementById('impact');
  if (impactSection && 'IntersectionObserver' in window) {
    let triggered = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !triggered) {
          triggered = true;
          animateCounters();
        }
      });
    }, { threshold: 0.25 });
    observer.observe(impactSection);
  } else {
    animateCounters();
  }

  // ==========================================================================
  // 7. Initial Autoplay Kickoff
  // ==========================================================================
  // Gentle delay to let layout settle before the hanger drops
  setTimeout(() => {
    runStoryAnimation();
  }, 400);
});
