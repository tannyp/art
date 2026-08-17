/* grid gallery: scroll reveal + lightbox
   any [data-lb] element opens the lightbox for its project group.
   the full image set per project lives in data-set (comma separated paths),
   falling back to the visible grid images. */
(function () {
    'use strict';

    function reveal() {
        var els = document.querySelectorAll('.reveal');
        if (!('IntersectionObserver' in window)) {
            els.forEach(function (el) { el.classList.add('is-in'); });
            return;
        }
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add('is-in');
                    io.unobserve(e.target);
                }
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
        els.forEach(function (el) { io.observe(el); });
    }

    function buildLightbox() {
        var lb = document.createElement('div');
        lb.className = 'lb';
        lb.innerHTML =
            '<div class="lb__stage"><img alt=""></div>' +
            '<div class="lb__bar">' +
                '<span class="lb__title"></span>' +
                '<span class="lb__count"></span>' +
                '<span><button data-lb-prev>prev</button>' +
                '<button data-lb-next>next</button>' +
                '<button data-lb-close>close</button></span>' +
            '</div>';
        document.body.appendChild(lb);
        return lb;
    }

    document.addEventListener('DOMContentLoaded', function () {
        reveal();

        var triggers = document.querySelectorAll('[data-lb]');
        if (!triggers.length) return;

        var lb = buildLightbox();
        var img = lb.querySelector('.lb__stage img');
        var title = lb.querySelector('.lb__title');
        var count = lb.querySelector('.lb__count');
        var set = [];
        var i = 0;

        function show(n) {
            if (!set.length) return;
            i = (n + set.length) % set.length;
            img.src = set[i];
            count.textContent = (i + 1) + ' / ' + set.length;
        }

        function open(group, start) {
            var scope = document.querySelector('[data-lb-group="' + group + '"]');
            if (!scope) return;
            var declared = scope.getAttribute('data-set');
            set = declared
                ? declared.split(',').map(function (s) { return s.trim(); }).filter(Boolean)
                : Array.prototype.map.call(scope.querySelectorAll('img'), function (el) { return el.src; });
            title.textContent = scope.getAttribute('data-lb-title') || '';
            show(start || 0);
            lb.classList.add('is-open');
            document.body.style.overflow = 'hidden';
        }

        function close() {
            lb.classList.remove('is-open');
            document.body.style.overflow = '';
            img.src = '';
        }

        triggers.forEach(function (t) {
            t.addEventListener('click', function () {
                open(t.getAttribute('data-lb'), parseInt(t.getAttribute('data-lb-start') || '0', 10));
            });
        });

        lb.addEventListener('click', function (e) {
            if (e.target.hasAttribute('data-lb-close') || e.target === lb || e.target.classList.contains('lb__stage')) close();
            else if (e.target.hasAttribute('data-lb-next')) show(i + 1);
            else if (e.target.hasAttribute('data-lb-prev')) show(i - 1);
        });

        document.addEventListener('keydown', function (e) {
            if (!lb.classList.contains('is-open')) return;
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowRight') show(i + 1);
            if (e.key === 'ArrowLeft') show(i - 1);
        });
    });
})();
