/* GOWDA'S FOOD · interactions */
(function () {
  'use strict';

  /* ---- Loader ---- */
  window.addEventListener('load', function () {
    var loader = document.getElementById('loader');
    if (loader) setTimeout(function () { loader.classList.add('done'); }, 700);
  });

  /* ---- Nav: scrolled state ---- */
  var nav = document.getElementById('nav');
  var onScroll = function () {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  var closeMenu = function () {
    links.classList.remove('open');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
  };
  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    toggle.classList.toggle('active', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });

  /* ---- Reveal on scroll ---- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var siblings = Array.prototype.slice.call(el.parentElement.querySelectorAll('.reveal'));
          var i = siblings.indexOf(el);
          el.style.transitionDelay = Math.min(i * 70, 350) + 'ms';
          el.classList.add('in');
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Menu category filter ---- */
  var menuFilter = document.getElementById('menuFilter');
  if (menuFilter) {
    var cats = document.querySelectorAll('.menu-cat');
    var catsWrap = document.querySelector('.menu-cats');
    menuFilter.addEventListener('click', function (e) {
      var btn = e.target.closest('.menu-filter__btn');
      if (!btn) return;
      var f = btn.getAttribute('data-filter');
      menuFilter.querySelectorAll('.menu-filter__btn').forEach(function (b) {
        b.classList.toggle('is-active', b === btn);
      });
      cats.forEach(function (cat) {
        cat.hidden = !(f === 'all' || cat.getAttribute('data-cat') === f);
      });
      if (catsWrap) catsWrap.classList.toggle('is-single', f !== 'all');
    });
  }

  /* ---- Footer year ---- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
