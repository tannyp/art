/* main.js */
(function () {

  /* ── Build work grid from data/work.json ───────────────────────────────── */
  const grid = document.getElementById('workGrid');

  const filmGrid = document.getElementById('filmGrid');
  const videoGrid = document.getElementById('videoGrid');

  // the photo curator (curate/server.py) injects unpublished edits here for its preview
  const draft = window.__CURATE__ || {};

  // data/site.js holds the same lists as a script, for when index.html is opened
  // straight from disk (file://), where the browser blocks fetching the JSON
  const bundled = window.__SITE__ || {};

  function load(name) {
    if (draft[name]) return Promise.resolve(draft[name]);
    // no-cache: always check for a newer list, so a publish shows up on the next reload
    return fetch('data/' + name + '.json', { cache: 'no-cache' })
      .then(r => r.json())
      .catch(() => bundled[name] || []);
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
    const [images, films, videos] = await Promise.all([load('work'), load('film'), load('video')]);
    if (filmGrid) buildFilmGrid(films);
    if (videoGrid) buildVideoGrid(videos);

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

  /* ── Video grid (data/video.json) with inline playback ─────────────────── */
  function buildVideoGrid(videos) {
    videos.forEach(v => {
      if (!v.id) return;
      const card = document.createElement('div');
      card.className = 'video-card';
      card.dataset.vid = v.id;
      const thumb = document.createElement('div');
      thumb.className = 'video-card__thumb';
      const img = document.createElement('img');
      img.className = 'lazy';
      img.dataset.src = `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`;
      img.src = '';
      img.alt = v.title || '';
      thumb.appendChild(img);
      const cap = document.createElement('span');
      cap.className = 'video-card__cap';
      cap.textContent = v.title || '';
      card.append(thumb, cap);

      card.addEventListener('click', () => {
        if (thumb.querySelector('iframe')) return;
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${v.id}?autoplay=1&rel=0`;
        iframe.allow = 'autoplay; encrypted-media; fullscreen';
        iframe.allowFullscreen = true;
        thumb.innerHTML = '';
        thumb.appendChild(iframe);
      });
      videoGrid.appendChild(card);
    });
  }

  buildWorkGrid();

})();
