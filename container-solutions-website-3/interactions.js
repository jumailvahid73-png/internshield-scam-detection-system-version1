// Small, dependency-free enhancements layered on top of the redesign:
// scroll-reveal, an animated stats counter, and an auto-advancing
// testimonial slider. Guards itself against the site's own slick/bootstrap
// JS in case those load too, and respects prefers-reduced-motion.
(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  // ---------- scroll reveal ----------
  function initScrollReveal() {
    // .testimonial-box is deliberately excluded: those slides live inside the
    // auto-slider and toggle display:none/block, so an IntersectionObserver
    // would never "see" the slides that haven't been shown yet and they'd
    // stay stuck at opacity:0 forever once the slider rotated to them. Their
    // entrance animation is handled by the slider's own csFadeUp instead.
    var targets = document.querySelectorAll(
      ".service-box, .choose-box, .client-box, .conuter-wrapper .lead-img"
    );
    if (!targets.length) return;

    if (reduceMotion || typeof IntersectionObserver === "undefined") {
      targets.forEach(function (el) {
        el.classList.add("cs-in-view");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("cs-in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach(function (el) {
      el.classList.add("cs-reveal");
      observer.observe(el);
    });
  }

  // ---------- count-up ----------
  function initCounters() {
    var counters = document.querySelectorAll(".counter[data-to]");
    if (!counters.length) return;

    function animateCounter(el) {
      if (el.dataset.csCounted === "true") return;
      el.dataset.csCounted = "true";

      var target = parseFloat(el.getAttribute("data-to"), 10) || 0;
      var suffix = el.querySelector("sup") ? el.querySelector("sup").outerHTML : "";

      if (reduceMotion) {
        el.textContent = target;
        if (suffix) el.insertAdjacentHTML("beforeend", suffix);
        return;
      }

      var duration = parseInt(el.getAttribute("data-speed"), 10) || 1600;
      var start = null;

      function step(timestamp) {
        if (start === null) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target;
          if (suffix) el.insertAdjacentHTML("beforeend", suffix);
        }
      }
      requestAnimationFrame(step);
    }

    if (typeof IntersectionObserver === "undefined") {
      counters.forEach(animateCounter);
      return;
    }

    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    counters.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  // ---------- testimonial auto-slider ----------
  function initTestimonialSlider() {
    var slider = document.querySelector(".testimonal-slider");
    if (!slider) return;

    // if the site's own slick carousel already took over this element,
    // don't fight it.
    if (slider.classList.contains("slick-initialized")) return;

    var slides = Array.prototype.slice.call(slider.children).filter(function (node) {
      return node.nodeType === 1;
    });
    if (slides.length < 2) return;

    slider.classList.add("cs-slider");

    var dotsWrap = document.createElement("div");
    dotsWrap.className = "cs-slider-dots";
    dotsWrap.setAttribute("role", "tablist");
    dotsWrap.setAttribute("aria-label", "Testimonials");
    slider.parentNode.insertBefore(dotsWrap, slider.nextSibling);

    var dots = slides.map(function (_, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", "Show testimonial " + (i + 1));
      dot.addEventListener("click", function () {
        goTo(i);
        restart();
      });
      dotsWrap.appendChild(dot);
      return dot;
    });

    var current = 0;
    var timer = null;
    var intervalMs = 6000;

    function goTo(index) {
      slides[current].classList.remove("cs-slide-active");
      dots[current].classList.remove("cs-dot-active");
      current = (index + slides.length) % slides.length;
      slides[current].classList.add("cs-slide-active");
      dots[current].classList.add("cs-dot-active");
    }

    function next() {
      goTo(current + 1);
    }

    function start() {
      if (reduceMotion) return;
      stop();
      timer = window.setInterval(next, intervalMs);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    function restart() {
      stop();
      start();
    }

    goTo(0);
    start();

    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);
    slider.addEventListener("focusin", stop);
    slider.addEventListener("focusout", start);
  }

  onReady(function () {
    initScrollReveal();
    initCounters();
    initTestimonialSlider();
  });
})();
