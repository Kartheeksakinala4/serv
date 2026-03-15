/* ============================================================
   CyberShield Pro — Main JavaScript
   ============================================================ */

'use strict';

/* ---------- Navbar scroll behaviour ---------- */
(function () {
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = current;
  }, { passive: true });
})();

/* ---------- Mobile hamburger ---------- */
(function () {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');

  btn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });

  // Close on nav link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      btn.setAttribute('aria-expanded', false);
    });
  });
})();

/* ---------- Matrix rain canvas ---------- */
(function () {
  const canvas = document.getElementById('matrixCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*<>/\\|{}[]~`';
  const FONT_SIZE = 14;
  let columns, drops;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    columns = Math.floor(canvas.width / FONT_SIZE);
    drops = Array.from({ length: columns }, () => Math.random() * canvas.height / FONT_SIZE | 0);
  }

  function draw() {
    ctx.fillStyle = 'rgba(8,9,13,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${FONT_SIZE}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      const ch    = CHARS[Math.random() * CHARS.length | 0];
      const alpha = Math.random() > 0.8 ? 0.9 : 0.35;
      ctx.fillStyle = `rgba(0,229,255,${alpha})`;
      ctx.fillText(ch, i * FONT_SIZE, drops[i] * FONT_SIZE);

      if (drops[i] * FONT_SIZE > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  setInterval(draw, 50);
})();

/* ---------- Intersection Observer — fade-in elements ---------- */
(function () {
  const targets = document.querySelectorAll(
    '.overview-card, .pentest-card, .posture-item, .deploy-card, .soc-feature, ' +
    '.ti-item, .forensics-card, .solution-card, .rt-item, .why-card, ' +
    '.process-step, .contact-method'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in', 'visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach((el, i) => {
    el.classList.add('fade-in');
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    observer.observe(el);
  });
})();

/* ---------- Smooth active nav link highlight ---------- */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navAnchors.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${id}`
            ? 'var(--accent)'
            : '';
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => io.observe(s));
})();

/* ---------- Contact form ---------- */
(function () {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled  = true;
    btn.textContent = 'Sending…';

    // Simulate async submission (replace with real fetch/API call)
    setTimeout(() => {
      form.reset();
      btn.disabled    = false;
      btn.innerHTML   = 'Send Enquiry &nbsp;&#10132;';
      success.classList.add('visible');

      setTimeout(() => success.classList.remove('visible'), 6000);
    }, 1200);
  });
})();

/* ---------- Stat counter animation ---------- */
(function () {
  const statNums = document.querySelectorAll('.stat-num');

  function animateCount(el) {
    const raw   = el.textContent.trim();
    const suffix = raw.replace(/[\d,.]+/, '');
    const target = parseFloat(raw.replace(/[^0-9.]/g, ''));
    if (isNaN(target)) return;

    const duration = 1600;
    const start    = performance.now();
    const startVal = 0;

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = startVal + (target - startVal) * eased;

      const display = target >= 1000
        ? (value >= 1000 ? (value / 1000).toFixed(1) + 'K' : Math.round(value).toString())
        : (target % 1 !== 0 ? value.toFixed(1) : Math.round(value).toString());

      el.textContent = display + suffix;

      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = raw; // snap to exact final value
    }

    requestAnimationFrame(step);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.8 });

  statNums.forEach(el => io.observe(el));
})();
