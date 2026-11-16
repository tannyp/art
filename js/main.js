/* main.js */
(function () {

  /* ── Build work grid from data/work.json ───────────────────────────────── */
  const grid = document.getElementById('workGrid');

  const filmGrid = document.getElementById('filmGrid');

  // the photo curator (curate/server.py) injects unpublished edits here for its preview
  const draft = window.__CURATE__ || {};

  function load(name) {
    if (draft[name]) return Promise.resolve(draft[name]);
    // no-cache: always check for a newer list, so a publish shows up on the next reload
    return fetch('data/' + name + '.json', { cache: 'no-cache' }).then(r => r.json()).catch(() => []);
  }

  function buildFilmGrid(films) {
    films.forEach(f => {
      const fig = document.createElement('figure');
      fig.className = 'film-card';
      const img = document.createElement('img');
      img.className = 'lazy';
      img.dataset.src = f.src;
      img.src = '';
      img.alt = f.title || '';
      const cap = document.createElement('figcaption');
      cap.textContent = f.title || '';
      if (f.credit) {
        const em = document.createElement('em');
        em.textContent = f.credit;
        cap.appendChild(em);
      }
      fig.append(img, cap);
      filmGrid.appendChild(fig);
    });
  }

  async function buildWorkGrid() {
    const [images, films] = await Promise.all([load('work'), load('film')]);
    if (filmGrid) buildFilmGrid(films);

    images.forEach((src, i) => {
      const fig = document.createElement('figure');
      const img = document.createElement('img');
      img.alt = src.split('/').pop().replace(/\.[^.]+$/, '');

      if (i < 3) {
        img.src = src;
        img.fetchPriority = 'high';
      } else if (i < 6) {
        img.src = src; // eager but no special priority
      } else {
        img.className = 'lazy';
        img.dataset.src = src;
        img.src = '';
      }

      fig.appendChild(img);
      grid.appendChild(fig);
    });

    // init lazy observer after grid is built
    initLazy();
    // init lightbox after grid is built
    initLightbox();
  }

  /* ── Lazy image loading ─────────────────────────────────────────────────── */
  function initLazy() {
    const lazyImgs = document.querySelectorAll('img.lazy');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const img = e.target;
        img.src = img.dataset.src;
        img.onload = () => img.classList.add('img-loaded');
        obs.unobserve(img);
      });
    }, { rootMargin: '400px 0px' });
    lazyImgs.forEach(img => obs.observe(img));
  }

  /* ── Lightbox ───────────────────────────────────────────────────────────── */
  function initLightbox() {
    const lb    = document.querySelector('.lb');
    const lbImg = lb.querySelector('.lb__img');
    let figs = [];
    let cur = 0;

    function getFigs() {
      figs = Array.from(document.querySelectorAll('.work-grid figure'));
    }

    function imgSrc(fig) {
      const img = fig.querySelector('img');
      return img.dataset.src || img.src;
    }

    function lbOpen(i) {
      getFigs();
      cur = i;
      lbImg.src = imgSrc(figs[i]);
      lbImg.alt = figs[i].querySelector('img').alt;
      lb.classList.add('lb--open');
      document.body.style.overflow = 'hidden';
    }

    function lbClose() {
      lb.classList.remove('lb--open');
      document.body.style.overflow = '';
    }

    grid.addEventListener('click', e => {
      const fig = e.target.closest('figure');
      if (!fig) return;
      getFigs();
      lbOpen(figs.indexOf(fig));
    });

    lb.addEventListener('click', e => { if (e.target === lb) lbClose(); });
    lb.querySelector('.lb__close').addEventListener('click', lbClose);
    lb.querySelector('.lb__prev').addEventListener('click', e => {
      e.stopPropagation();
      getFigs();
      lbOpen((cur - 1 + figs.length) % figs.length);
    });
    lb.querySelector('.lb__next').addEventListener('click', e => {
      e.stopPropagation();
      getFigs();
      lbOpen((cur + 1) % figs.length);
    });

    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('lb--open')) return;
      if (e.key === 'Escape')     lbClose();
      if (e.key === 'ArrowLeft')  { getFigs(); lbOpen((cur - 1 + figs.length) % figs.length); }
      if (e.key === 'ArrowRight') { getFigs(); lbOpen((cur + 1) % figs.length); }
    });
  }

  /* ── Inline video playback ──────────────────────────────────────────────── */
  document.querySelectorAll('.video-card').forEach(card => {
    const thumb = card.querySelector('.video-card__thumb');
    card.addEventListener('click', () => {
      if (thumb.querySelector('iframe')) return;
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${card.dataset.vid}?autoplay=1&rel=0`;
      iframe.allow = 'autoplay; encrypted-media; fullscreen';
      iframe.allowFullscreen = true;
      thumb.innerHTML = '';
      thumb.appendChild(iframe);
    });
  });

  buildWorkGrid();

})();
