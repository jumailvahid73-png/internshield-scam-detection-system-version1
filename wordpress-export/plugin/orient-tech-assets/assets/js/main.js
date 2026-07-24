// Orient Tech — main site interactions
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Sticky header ---------- */
  const header = document.querySelector('.site-header');
  const onScrollHeader = () => {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add('solid');
    else header.classList.remove('solid');
  };
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navClose = document.querySelector('.nav-close');
  const body = document.body;
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      body.classList.toggle('nav-open');
    });
  }
  if (navClose) {
    navClose.addEventListener('click', () => body.classList.remove('nav-open'));
  }
  document.querySelectorAll('.main-nav a.nav-link').forEach(link => {
    if (link.parentElement.classList.contains('has-dropdown')) return;
    link.addEventListener('click', () => body.classList.remove('nav-open'));
  });
  document.querySelectorAll('.dropdown-panel a').forEach(link => {
    link.addEventListener('click', () => body.classList.remove('nav-open'));
  });
  document.querySelectorAll('.has-dropdown > .nav-link').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      if (window.innerWidth <= 1080) {
        e.preventDefault();
        trigger.closest('.has-dropdown').classList.toggle('open');
      }
    });
  });

  /* ---------- Scroll-reveal animations ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-fade');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------- Animated stat counters ---------- */
  const counters = document.querySelectorAll('.counter[data-count]');
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window && counters.length) {
    const counterIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterIO.observe(c));
  }

  /* ---------- Product category filter tabs ---------- */
  document.querySelectorAll('.filter-tabs').forEach(tabGroup => {
    const grid = document.querySelector(tabGroup.dataset.target);
    if (!grid) return;
    const cards = grid.querySelectorAll('.product-card');
    tabGroup.addEventListener('click', (e) => {
      const tab = e.target.closest('.filter-tab');
      if (!tab) return;
      tabGroup.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const category = tab.dataset.category;
      cards.forEach(card => {
        const show = category === 'all' || card.dataset.category === category;
        card.classList.toggle('filtered-out', !show);
        if (show) card.classList.add('in-view');
      });
    });
  });

  /* ---------- Back to top ---------- */
  const backTop = document.querySelector('.back-top');
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('show', window.scrollY > 500);
    }, { passive: true });
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- Quote / contact form -> WhatsApp handoff ---------- */
  const quoteForm = document.querySelector('#quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(quoteForm);
      const name = (data.get('name') || '').toString().trim();
      const phone = (data.get('phone') || '').toString().trim();
      const email = (data.get('email') || '').toString().trim();
      const product = (data.get('product') || '').toString().trim();
      const message = (data.get('message') || '').toString().trim();

      const lines = [
        'Hello Orient Tech, I would like to request a quote.',
        name ? `Name: ${name}` : '',
        phone ? `Phone: ${phone}` : '',
        email ? `Email: ${email}` : '',
        product ? `Product: ${product}` : '',
        message ? `Details: ${message}` : ''
      ].filter(Boolean).join('\n');

      const waNumber = '97450843355';
      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(lines)}`;

      const successBox = document.querySelector('.form-success');
      if (successBox) successBox.classList.add('show');
      quoteForm.reset();
      window.open(waUrl, '_blank', 'noopener');
    });
  }

  /* ---------- Pre-fill product field from URL (?product=) ---------- */
  const params = new URLSearchParams(window.location.search);
  const productParam = params.get('product');
  if (productParam) {
    const productField = document.querySelector('#quoteForm [name="product"]');
    if (productField) productField.value = decodeURIComponent(productParam);
  }

  /* ---------- Current year in footer ---------- */
  document.querySelectorAll('.current-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
});
