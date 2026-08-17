/* book: plate lightbox + spread-by-spread keyboard paging */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        /* --- lightbox over every plate on every page --------------------- */
        var plates = Array.prototype.slice.call(document.querySelectorAll('.plate'));
        var set = plates.map(function (p) { return p.querySelector('img').getAttribute('src'); });

        var lb = document.createElement('div');
        lb.className = 'lb';
        lb.innerHTML =
            '<div class="lb__stage"><img alt=""></div>' +
            '<div class="lb__bar"><span class="lb__count"></span>' +
            '<span><button data-prev>prev</button><button data-next>next</button>' +
            '<button data-close>close</button></span></div>';
        document.body.appendChild(lb);

        var img = lb.querySelector('img');
        var count = lb.querySelector('.lb__count');
        var i = 0;

        function show(n) {
            if (!set.length) return;
            i = (n + set.length) % set.length;
            img.src = set[i];
            count.textContent = (i + 1) + ' / ' + set.length + ' plates';
        }

        function close() {
            lb.classList.remove('is-open');
            document.body.style.overflow = '';
            img.src = '';
        }

        plates.forEach(function (p, n) {
            p.addEventListener('click', function () {
                show(n);
                lb.classList.add('is-open');
                document.body.style.overflow = 'hidden';
            });
        });

        lb.addEventListener('click', function (e) {
            if (e.target.hasAttribute('data-next')) show(i + 1);
            else if (e.target.hasAttribute('data-prev')) show(i - 1);
            else close();
        });

        /* --- paging ------------------------------------------------------ */
        var spreads = Array.prototype.slice.call(document.querySelectorAll('.spread'));

        function current() {
            var best = 0;
            var min = Infinity;
            spreads.forEach(function (s, n) {
                var d = Math.abs(s.getBoundingClientRect().top);
                if (d < min) { min = d; best = n; }
            });
            return best;
        }

        function go(n) {
            var s = spreads[Math.max(0, Math.min(spreads.length - 1, n))];
            if (s) s.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        document.addEventListener('keydown', function (e) {
            if (lb.classList.contains('is-open')) {
                if (e.key === 'Escape') close();
                if (e.key === 'ArrowRight') show(i + 1);
                if (e.key === 'ArrowLeft') show(i - 1);
                return;
            }
            if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); go(current() + 1); }
            if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(current() - 1); }
        });
    });
})();
