'use strict';

/* ---------- Navbar scroll ---------- */
(function () {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
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
  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      links.classList.remove('open');
      btn.setAttribute('aria-expanded', false);
    })
  );
})();

/* ---------- Matrix rain canvas ---------- */
(function () {
  const canvas = document.getElementById('matrixCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const CHARS = '01ABCDEF#$%@<>/\\|[]{}';
  const FS = 13;
  let columns, drops;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    columns = Math.floor(canvas.width / FS);
    drops   = Array.from({ length: columns }, () =>
      Math.random() * (canvas.height / FS) | 0
    );
  }

  function draw() {
    ctx.fillStyle = 'rgba(248,250,252,0.06)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${FS}px monospace`;
    for (let i = 0; i < drops.length; i++) {
      const ch    = CHARS[Math.random() * CHARS.length | 0];
      const alpha = Math.random() > 0.8 ? 0.7 : 0.25;
      ctx.fillStyle = `rgba(0,87,255,${alpha})`;
      ctx.fillText(ch, i * FS, drops[i] * FS);
      if (drops[i] * FS > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  setInterval(draw, 55);
})();

/* ---------- Stat counter ---------- */
(function () {
  const els = document.querySelectorAll('.stat-num[data-target]');

  function animateCount(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '+';
    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const value    = Math.round(target * eased);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString() + suffix;
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

  els.forEach(el => io.observe(el));
})();

/* ---------- Fade-in on scroll ---------- */
(function () {
  const targets = document.querySelectorAll(
    '.overview-card, .offering-card, .pentest-card, ' +
    '.ti-block, .ti-dash-features .td-feat, ' +
    '.forensics-card, .why-card, .awareness-stat-card, ' +
    '.contact-method, .fp-step'
  );

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

  targets.forEach((el, i) => {
    el.classList.add('fade-in');
    el.style.transitionDelay = `${(i % 4) * 0.07}s`;
    io.observe(el);
  });
})();

/* ---------- Active nav highlight ---------- */
(function () {
  const sections   = document.querySelectorAll('section[id], .service-section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navAnchors.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${id}`
            ? 'var(--accent)' : '';
        });
      }
    });
  }, { threshold: 0.4 });

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
    btn.disabled    = true;
    btn.textContent = 'Sending…';

    setTimeout(() => {
      form.reset();
      btn.disabled  = false;
      btn.innerHTML = 'Send Enquiry &nbsp;&#10132;';
      success.classList.add('visible');
      setTimeout(() => success.classList.remove('visible'), 6000);
    }, 1200);
  });
})();
