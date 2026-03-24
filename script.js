// =========================================
//   PORTFOLIO — script.js
// =========================================

(function () {
  'use strict';

  /* ---- Theme ---- */
  const KEY = 'portfolio-theme';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(KEY, theme);
    const btn = document.querySelector('.theme-toggle');
    if (!btn) return;
    const icon  = btn.querySelector('.toggle-icon');
    const label = btn.querySelector('.toggle-label');
    if (icon)  icon.textContent  = theme === 'dark' ? '☀' : '◑';
    if (label) label.textContent = theme === 'dark' ? 'Light' : 'Dark';
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  function initTheme() {
    const saved     = localStorage.getItem(KEY);
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    applyTheme(saved || preferred);
    document.querySelector('.theme-toggle')?.addEventListener('click', () => {
      applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  }

  /* ---- Active nav ---- */
  function initActiveNav() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(a => {
      const href = a.getAttribute('href');
      if (href === page || (page === '' && href === 'index.html')) a.classList.add('active');
    });
  }

  /* ---- Hamburger ---- */
  function initHamburger() {
    const ham   = document.querySelector('.hamburger');
    const links = document.querySelector('.nav-links');
    if (!ham || !links) return;

    const toggle = (open) => {
      links.classList.toggle('open', open);
      ham.setAttribute('aria-expanded', String(open));
      const [b1, b2, b3] = ham.querySelectorAll('span');
      b1.style.transform = open ? 'rotate(45deg) translate(4.5px, 4.5px)' : '';
      b2.style.opacity   = open ? '0' : '';
      b3.style.transform = open ? 'rotate(-45deg) translate(4.5px, -4.5px)' : '';
    };

    ham.addEventListener('click', () => toggle(!links.classList.contains('open')));
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggle(false)));
  }

  /* ---- Nav scroll shadow ---- */
  function initNavScroll() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    const update = () => nav.classList.toggle('scrolled', window.scrollY > 8);
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ---- Scroll reveal ---- */
  function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    items.forEach(el => io.observe(el));
  }

  /* ---- Card click ---- */
  function initCards() {
    document.querySelectorAll('.project-card[data-href]').forEach(card => {
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'link');
      card.addEventListener('click', () => { window.location.href = card.dataset.href; });
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.location.href = card.dataset.href; }
      });
    });
  }
  /* ---- Slideshows ---- */
function initSlideshows() {
  document.querySelectorAll('.slideshow').forEach(show => {
    const track = show.querySelector('.slideshow-track');
    const slides = show.querySelectorAll('.slideshow-slide');
    const dots = show.querySelectorAll('.slideshow-dot');
    if (!slides.length) return;

    const total = slides.length;
    let current = 0;
    let timer;
    let isAnimating = false;

    // Build an infinite strip: [last, ...slides, first]
    const firstClone = slides[0].cloneNode(true);
    const lastClone  = slides[total - 1].cloneNode(true);
    track.appendChild(firstClone);
    track.insertBefore(lastClone, slides[0]);

    // Start at position 1 (the real first slide, after the cloned last)
    let pos = 1;
    track.style.transition = 'none';
    track.style.transform = `translateX(-${pos * 100}%)`;

    function updateDots() {
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function jumpTo(newPos, newCurrent) {
      if (isAnimating) return;
      isAnimating = true;
      pos = newPos;
      current = ((newCurrent % total) + total) % total;
      track.style.transition = 'transform 0.55s cubic-bezier(0.4,0,0.2,1)';
      track.style.transform = `translateX(-${pos * 100}%)`;
      updateDots();
    }

    track.addEventListener('transitionend', () => {
      // If we landed on a clone, jump instantly to the real slide
      if (pos === 0) {
        track.style.transition = 'none';
        pos = total;
        track.style.transform = `translateX(-${pos * 100}%)`;
      } else if (pos === total + 1) {
        track.style.transition = 'none';
        pos = 1;
        track.style.transform = `translateX(-${pos * 100}%)`;
      }
      isAnimating = false;
    });

    function next() { jumpTo(pos + 1, current + 1); }
    function prev() { jumpTo(pos - 1, current - 1); }

    function startTimer() {
      clearInterval(timer);
      timer = setInterval(next, 4000);
    }

    show.querySelector('.slideshow-btn--prev')
      ?.addEventListener('click', e => { e.stopPropagation(); prev(); startTimer(); });
    show.querySelector('.slideshow-btn--next')
      ?.addEventListener('click', e => { e.stopPropagation(); next(); startTimer(); });
    dots.forEach((dot, i) =>
      dot.addEventListener('click', e => {
        e.stopPropagation();
        jumpTo(i + 1, i);
        startTimer();
      }));

    updateDots();
    startTimer();
  });
}
  /* ---- Init ---- */
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initActiveNav();
    initHamburger();
    initNavScroll();
    initReveal();
    initCards();
    initSlideshows();
  });

})();
