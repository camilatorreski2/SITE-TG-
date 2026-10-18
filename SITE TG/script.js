
/**
 * TG Digital Studio — Scripts
 * Cada recurso do site fica em uma função própria (init...).
 */
(() => {
  'use strict';

  /*Utilitários */
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /*Menu mobile */
  function initMobileMenu() {
    const toggle = $('.nav-toggle');
    const nav = $('#main-nav');
    if (!toggle || !nav) return;

    const setOpen = (isOpen) => {
      nav.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    };

    toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
    $$('.nav__link', nav).forEach((link) => link.addEventListener('click', () => setOpen(false)));
  }

  /*Revelar elementos ao rolar */
  function initRevealOnScroll() {
    const items = $$('.reveal');

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const delay = Number(entry.target.dataset.delay) || 0;
        setTimeout(() => entry.target.classList.add('is-visible'), delay);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    items.forEach((el, index) => {
      el.dataset.delay = (index % 4) * 100; // efeito escalonado
      observer.observe(el);
    });
  }

  /*Contadores animados */
  function initCounters() {
    $$('[data-count]').forEach((el) => {
      const target = Number(el.dataset.count);
      const step = Math.max(1, Math.floor(target / 40));
      let current = 0;

      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current;
        if (current === target) clearInterval(timer);
      }, 40);
    });
  }

  /*Cards: brilho + inclinação 3D */
  function initCardTilt() {
    const MAX_TILT = 8; // graus

    $$('[data-tilt]').forEach((card) => {
      card.addEventListener('mousemove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateX = (y / rect.height - 0.5) * -MAX_TILT;
        const rotateY = (x / rect.width - 0.5) * MAX_TILT;

        card.style.setProperty('--x', `${x}px`);
        card.style.setProperty('--y', `${y}px`);
        card.style.transform =
          `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /*Parallax das janelas do hero */
  function initHeroParallax() {
    const stage = $('[data-parallax]');
    if (!stage || prefersReducedMotion) return;

    document.addEventListener('mousemove', (event) => {
      if (window.innerWidth < 860) return;
      const rotateY = (event.clientX / window.innerWidth - 0.5) * 14;
      const rotateX = (event.clientY / window.innerHeight - 0.5) * -10;
      stage.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    });
  }

  /* Métricas do painel ao vivo */
  function initLiveMetrics() {
    const visitsEl = $('[data-live="visits"]');
    const salesEl = $('[data-live="sales"]');
    const growthEl = $('[data-live="growth"]');
    if (!visitsEl || !salesEl || !growthEl) return;

    let visits = 1248;
    let sales = 86;

    setInterval(() => {
      visits += Math.floor(Math.random() * 9);
      if (Math.random() > 0.6) sales += 1;

      visitsEl.textContent = visits.toLocaleString('pt-BR');
      salesEl.textContent = sales;
      growthEl.textContent = `+${30 + Math.floor(Math.random() * 5)}%`;
    }, 1500);
  }

  /*Inicialização */
  initMobileMenu();
  initRevealOnScroll();
  initCounters();
  initCardTilt();
  initHeroParallax();
  initLiveMetrics();

})();