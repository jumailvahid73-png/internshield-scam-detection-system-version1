/* Custom JavaScript — wires up jQuery, GSAP + ScrollTrigger, Locomotive Scroll,
   Barba.js page transitions and Vanilla LazyLoad for the portfolio. */
(function () {
  'use strict';

  var isFile = window.location.protocol === 'file:';
  var hasBarba = typeof window.barba !== 'undefined';
  var hasGsap = typeof window.gsap !== 'undefined';
  var hasLocomotive = typeof window.LocomotiveScroll !== 'undefined';
  var hasLazyLoad = typeof window.LazyLoad !== 'undefined';

  if (hasGsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  var locoScroll = null;
  var lazyLoadInstance = null;
  var navEl = document.getElementById('siteNav');
  var progressBar = document.getElementById('scrollProgress');
  var navLinks = document.querySelectorAll('nav.links a[data-page], .nav-cta[data-page]');

  function setActiveNav(page) {
    navLinks.forEach(function (a) {
      a.classList.toggle('active', a.dataset.page === page);
    });
  }

  function updateYear(container) {
    var y = container.querySelector('#year');
    if (y) y.textContent = new Date().getFullYear();
  }

  function killLoco() {
    if (locoScroll) {
      try { locoScroll.destroy(); } catch (e) { /* noop */ }
      locoScroll = null;
    }
    if (hasGsap && window.ScrollTrigger) {
      ScrollTrigger.getAll().forEach(function (st) { st.kill(); });
    }
  }

  function initScrollSystem(container) {
    var scrollContainer = container.querySelector('[data-scroll-container]');
    if (!scrollContainer) return;

    killLoco();

    if (hasLocomotive) {
      locoScroll = new LocomotiveScroll({
        el: scrollContainer,
        smooth: true,
        lerp: 0.09,
        multiplier: 1,
        tablet: { smooth: false },
        smartphone: { smooth: false }
      });

      if (hasGsap && window.ScrollTrigger) {
        locoScroll.on('scroll', ScrollTrigger.update);

        ScrollTrigger.scrollerProxy(scrollContainer, {
          scrollTop: function (value) {
            if (!locoScroll) return 0;
            if (arguments.length) {
              return locoScroll.scrollTo(value, { duration: 0, disableLerp: true });
            }
            return (locoScroll.scroll && locoScroll.scroll.instance) ? locoScroll.scroll.instance.scroll.y : 0;
          },
          getBoundingClientRect: function () {
            return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
          },
          pinType: scrollContainer.style.transform ? 'transform' : 'fixed'
        });

        ScrollTrigger.defaults({ scroller: scrollContainer });
      }

      locoScroll.on('scroll', function (args) {
        var scrollY = args.scroll.y;
        var limit = args.limit.y || 1;
        if (progressBar) progressBar.style.width = Math.min(100, (scrollY / limit) * 100) + '%';
        if (navEl) navEl.classList.toggle('scrolled', scrollY > 20);
      });
    } else {
      // Fallback: no Locomotive Scroll available, use native scroll.
      window.addEventListener('scroll', function () {
        var scrollY = window.scrollY;
        var limit = document.documentElement.scrollHeight - window.innerHeight;
        if (progressBar) progressBar.style.width = Math.min(100, (scrollY / Math.max(limit, 1)) * 100) + '%';
        if (navEl) navEl.classList.toggle('scrolled', scrollY > 20);
      });
    }
  }

  function initReveal(container) {
    if (!hasGsap) {
      container.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('reveal-ready');
        el.style.opacity = 1;
      });
      return;
    }
    container.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('reveal-ready');
      var parent = el.parentElement;
      var siblings = Array.prototype.filter.call(parent.children, function (c) {
        return c.classList.contains('reveal');
      });
      var idx = siblings.indexOf(el);

      gsap.fromTo(el,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
          delay: Math.min(idx * 0.07, 0.42),
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }

  function initParallax(container) {
    if (!hasGsap) return;
    container.querySelectorAll('[data-parallax]').forEach(function (el) {
      var speed = parseFloat(el.dataset.parallax) || 0.05;
      gsap.to(el, {
        y: 320 * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });
  }

  function initLazyLoad() {
    if (!hasLazyLoad) return;
    if (lazyLoadInstance) {
      try { lazyLoadInstance.destroy(); } catch (e) { /* noop */ }
    }
    lazyLoadInstance = new LazyLoad({ elements_selector: '.lazy' });
  }

  function initPage(container) {
    updateYear(container);
    initScrollSystem(container);
    initReveal(container);
    initParallax(container);
    initLazyLoad();
    if (hasGsap && window.ScrollTrigger) {
      ScrollTrigger.refresh();
    }
    setActiveNav(container.getAttribute('data-barba-namespace') || document.body.dataset.page);
  }

  function initNavChrome() {
    var burger = document.getElementById('burgerBtn');
    var links = document.querySelector('nav.links');
    if (!burger || !links) return;

    burger.addEventListener('click', function () {
      var open = links.style.display === 'flex';
      links.style.display = open ? 'none' : 'flex';
      links.style.cssText += 'position:fixed;top:64px;left:20px;right:20px;flex-direction:column;background:#ffffff;border:1px solid #e4e5ea;border-radius:14px;padding:20px;gap:16px;z-index:60;box-shadow:0 12px 30px -12px rgba(17,19,24,0.18);';
      if (open) links.style.display = 'none';
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        if (window.innerWidth <= 920) links.style.display = 'none';
      });
    });
  }

  function boot() {
    initNavChrome();

    var firstContainer = document.querySelector('[data-barba="container"]') || document.body;
    initPage(firstContainer);

    if (hasBarba && !isFile) {
      barba.init({
        transitions: [{
          name: 'fade',
          leave: function (data) {
            var done = this.async();
            if (hasGsap) {
              gsap.to(data.current.container, {
                opacity: 0, duration: 0.35, ease: 'power1.out',
                onComplete: done
              });
            } else {
              done();
            }
          },
          enter: function (data) {
            window.scrollTo(0, 0);
            if (hasGsap) {
              gsap.from(data.next.container, { opacity: 0, duration: 0.45, ease: 'power1.out' });
            }
          },
          after: function (data) {
            initPage(data.next.container);
          }
        }]
      });
    }
  }

  if (window.jQuery) {
    jQuery(boot);
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
