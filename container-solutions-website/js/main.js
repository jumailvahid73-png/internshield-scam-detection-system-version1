// Container Solutions — shared site interactions
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
  const body = document.body;
  if (navToggle) navToggle.addEventListener('click', () => body.classList.toggle('nav-open'));
  document.querySelectorAll('.main-nav a.nav-link').forEach(link => {
    link.addEventListener('click', () => body.classList.remove('nav-open'));
  });

  /* ---------- Scroll-reveal animations ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
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
    const target = parseFloat(el.getAttribute('data-count')) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const decimals = parseInt(el.getAttribute('data-decimals'), 10) || 0;
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = eased * target;
      el.textContent = prefix + (decimals ? val.toFixed(decimals) : Math.round(val)) + suffix;
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

  /* ---------- Back to top ---------- */
  const backTop = document.querySelector('.back-top');
  if (backTop) {
    window.addEventListener('scroll', () => backTop.classList.toggle('show', window.scrollY > 500), { passive: true });
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- Quote / enquiry form -> mailto handoff ---------- */
  const quoteForm = document.querySelector('#quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(quoteForm);
      const name = (data.get('name') || '').toString().trim();
      const phone = (data.get('phone') || '').toString().trim();
      const email = (data.get('email') || '').toString().trim();
      const service = (data.get('service') || '').toString().trim();
      const message = (data.get('message') || '').toString().trim();

      const bodyLines = [
        name ? `Name: ${name}` : '',
        phone ? `Phone: ${phone}` : '',
        email ? `Email: ${email}` : '',
        service ? `Service of interest: ${service}` : '',
        '',
        message || ''
      ].filter(Boolean).join('\n');

      const mailto = `mailto:enquiry@containersolutions.com?subject=${encodeURIComponent('Website Enquiry' + (service ? ' - ' + service : ''))}&body=${encodeURIComponent(bodyLines)}`;

      const successBox = document.querySelector('.form-success');
      if (successBox) successBox.classList.add('show');
      quoteForm.reset();
      window.location.href = mailto;
    });
  }

  /* ---------- Pre-fill service field from URL (?service=) ---------- */
  const params = new URLSearchParams(window.location.search);
  const serviceParam = params.get('service');
  if (serviceParam) {
    const serviceField = document.querySelector('#quoteForm [name="service"]');
    if (serviceField) serviceField.value = decodeURIComponent(serviceParam);
  }

  /* ---------- Hide scroll cue if it would overlap the hero content ---------- */
  const scrollCue = document.querySelector('.scroll-cue');
  const heroContentEl = document.querySelector('.hero .hero-content');
  if (scrollCue && heroContentEl) {
    const checkOverlap = () => {
      const cueRect = scrollCue.getBoundingClientRect();
      const contentRect = heroContentEl.getBoundingClientRect();
      scrollCue.style.display = (contentRect.bottom > cueRect.top - 12) ? 'none' : '';
    };
    checkOverlap();
    window.addEventListener('resize', checkOverlap);
  }

  /* ---------- Current year in footer ---------- */
  document.querySelectorAll('.current-year').forEach(el => { el.textContent = new Date().getFullYear(); });

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

  /* ---------- Ambient cursor glow ---------- */
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
    const tiltCards = document.querySelectorAll('.service-card, .mini-service-card, .feature-card, .value-card, .testimonial-card, .office-card, .cert-card, .showcase-item');
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

  /* ---------- Hero depth: mouse & scroll parallax (grid overlay is home-hero only) ---------- */
  const heroSection = document.querySelector('.hero, .page-hero');
  if (heroSection) {
    const isMainHero = heroSection.classList.contains('hero');
    let grid = null;
    if (isMainHero) {
      grid = heroSection.querySelector('.hero-grid');
      if (!grid) {
        grid = document.createElement('div');
        grid.className = 'hero-grid';
        grid.setAttribute('aria-hidden', 'true');
        heroSection.prepend(grid);
      }
    }
    const heroContent = heroSection.querySelector('.hero-content');
    const heroCanvas = heroSection.querySelector('.hero-canvas');
    const heroFallback = heroSection.querySelector('.hero-fallback-bg');

    let mx = 0, my = 0, scrollT = 0;

    function renderHero() {
      const bgY = scrollT * 60;
      const bgScale = 1 + scrollT * 0.08;
      if (grid) grid.style.transform = `translate3d(${mx * 24}px, ${my * 24 + bgY * 0.6}px, 0)`;
      if (heroCanvas) { heroCanvas.style.transform = `translate3d(0, ${bgY}px, 0) scale(${bgScale})`; heroCanvas.style.opacity = String(1 - scrollT * 0.6); }
      if (heroFallback) heroFallback.style.transform = `translate3d(0, ${bgY}px, 0) scale(${bgScale})`;
      if (heroContent) {
        const contentX = mx * -10;
        const contentY = my * -10 - scrollT * 90;
        const contentScale = 1 - scrollT * 0.08;
        heroContent.style.transform = `translate3d(${contentX}px, ${contentY}px, 0) scale(${contentScale})`;
        heroContent.style.opacity = String(Math.max(0, 1 - scrollT * 1.6));
      }
      window.dispatchEvent(new CustomEvent('cs:heroscroll', { detail: { progress: scrollT } }));
    }

    if (isMainHero && !reducedMotion) {
      const updateScroll = () => {
        const h = heroSection.offsetHeight || window.innerHeight;
        scrollT = Math.min(Math.max(window.scrollY / h, 0), 1);
        renderHero();
      };
      updateScroll();
      window.addEventListener('scroll', updateScroll, { passive: true });
      window.addEventListener('resize', updateScroll);
    }

    if (canHover && !reducedMotion) {
      heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        mx = (e.clientX - rect.left) / rect.width - 0.5;
        my = (e.clientY - rect.top) / rect.height - 0.5;
        renderHero();
      });
      heroSection.addEventListener('mouseleave', () => { mx = 0; my = 0; renderHero(); });
    }
  }

  /* ---------- Interactive locations map (contact page) ---------- */
  const mapEmbed = document.querySelector('.map-embed[data-offices]');
  if (mapEmbed) {
    let offices = [];
    try { offices = JSON.parse(mapEmbed.getAttribute('data-offices')); } catch (e) { offices = []; }

    const leafletCss = document.createElement('link');
    leafletCss.rel = 'stylesheet';
    leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(leafletCss);

    const leafletScript = document.createElement('script');
    leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    leafletScript.onload = () => {
      mapEmbed.innerHTML = '<div id="site-map"></div>';
      const map = L.map('site-map', { scrollWheelZoom: false }).setView([20, 45], 3);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18
      }).addTo(map);
      const pinIcon = L.divIcon({ className: 'ot-map-pin', html: '<span></span>', iconSize: [26, 26], iconAnchor: [13, 13] });
      const markers = [];
      offices.forEach(o => {
        const m = L.marker([o.lat, o.lng], { icon: pinIcon }).addTo(map)
          .bindPopup(`<strong>${o.name}</strong><br>${o.address}<br>${o.phone ? `<a href="tel:${o.phone.replace(/[^+\d]/g,'')}">${o.phone}</a>` : ''}`);
        markers.push(m);
      });
      if (markers.length) {
        const group = L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.4));
      }
      mapEmbed.addEventListener('click', () => map.scrollWheelZoom.enable());
      mapEmbed.addEventListener('mouseleave', () => map.scrollWheelZoom.disable());
    };
    document.body.appendChild(leafletScript);
  }
});
