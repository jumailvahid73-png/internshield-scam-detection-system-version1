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

  /* ---------- Scroll progress bar ---------- */
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);
  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);

  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Ambient cursor glow (desktop only, premium feel) ---------- */
  if (canHover && !reducedMotion) {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    glow.setAttribute('aria-hidden', 'true');
    document.body.appendChild(glow);
    let glowActive = false;
    window.addEventListener('mousemove', (e) => {
      glow.style.transform = `translate(${e.clientX - 220}px, ${e.clientY - 220}px)`;
      if (!glowActive) { glow.classList.add('active'); glowActive = true; }
    }, { passive: true });
    document.addEventListener('mouseleave', () => glow.classList.remove('active'));
  }

  /* ---------- 3D tilt on interactive cards ---------- */
  if (canHover && !reducedMotion) {
    const tiltCards = document.querySelectorAll('.product-card, .feature-card, .value-card, .process-step, .testimonial-card, .contact-card');
    tiltCards.forEach(card => {
      const maxTilt = 6;
      card.addEventListener('mouseenter', () => { card.style.transition = 'transform .12s ease-out'; });
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rotateY = (px - 0.5) * maxTilt * 2;
        const rotateX = (0.5 - py) * maxTilt * 2;
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform .5s cubic-bezier(0.16, 0.84, 0.44, 1)';
        card.style.transform = '';
      });
    });
  }

  /* ---------- Cinematic hero depth: industrial grid overlay + parallax ---------- */
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    const grid = document.createElement('div');
    grid.className = 'hero-grid';
    grid.setAttribute('aria-hidden', 'true');
    heroSection.prepend(grid);

    if (canHover && !reducedMotion) {
      const heroContent = heroSection.querySelector('.hero-content');
      heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        grid.style.transform = `translate3d(${px * 24}px, ${py * 24}px, 0)`;
        if (heroContent) heroContent.style.transform = `translate3d(${px * -10}px, ${py * -10}px, 0)`;
      });
      heroSection.addEventListener('mouseleave', () => {
        grid.style.transform = '';
        if (heroContent) heroContent.style.transform = '';
      });
    }
  }

  /* ---------- Interactive locations map (contact page) ---------- */
  const mapEmbed = document.querySelector('.map-embed');
  if (mapEmbed) {
    const leafletCss = document.createElement('link');
    leafletCss.rel = 'stylesheet';
    leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(leafletCss);

    const leafletScript = document.createElement('script');
    leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    leafletScript.onload = () => {
      mapEmbed.innerHTML = '<div id="site-map"></div>';
      const dohaCoords = [25.2854, 51.5310];
      const map = L.map('site-map', { scrollWheelZoom: false }).setView(dohaCoords, 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18
      }).addTo(map);
      const pinIcon = L.divIcon({
        className: 'ot-map-pin',
        html: '<span></span>',
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });
      L.marker(dohaCoords, { icon: pinIcon }).addTo(map)
        .bindPopup('<strong>Orient Tech</strong><br>Doha, Qatar<br><a href="https://wa.me/97450843355" target="_blank" rel="noopener">Chat on WhatsApp</a>')
        .openPopup();
      mapEmbed.addEventListener('click', () => map.scrollWheelZoom.enable());
      mapEmbed.addEventListener('mouseleave', () => map.scrollWheelZoom.disable());
    };
    document.body.appendChild(leafletScript);
  }
});
