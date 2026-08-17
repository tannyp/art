document.addEventListener('DOMContentLoaded', function() {
    if (typeof Swiper === 'undefined') return;

    document.querySelectorAll('.gallery-swiper').forEach(function(el) {
        var slideCount = el.querySelectorAll('.swiper-slide').length;
        var enableLoop = slideCount > 2;
        var wrap = el.closest('.gallery-swiper-wrap');

        if (slideCount <= 1 && wrap) {
            wrap.classList.add('gallery-swiper-wrap--single');
        }

        new Swiper(el, {
            effect: 'coverflow',
            grabCursor: slideCount > 1,
            centeredSlides: true,
            slidesPerView: 'auto',
            loop: enableLoop,
            speed: 500,
            spaceBetween: 24,
            coverflowEffect: {
                rotate: 0,
                stretch: 0,
                depth: 120,
                modifier: 2,
                slideShadows: false
            },
            pagination: slideCount > 1 ? {
                el: el.querySelector('.swiper-pagination'),
                clickable: true
            } : false,
            navigation: slideCount > 1 ? {
                nextEl: el.querySelector('.swiper-button-next'),
                prevEl: el.querySelector('.swiper-button-prev')
            } : false,
            keyboard: slideCount > 1 ? {
                enabled: true,
                onlyInViewport: true
            } : false,
            breakpoints: {
                0: {
                    spaceBetween: 16
                },
                768: {
                    spaceBetween: 24
                }
            }
        });
    });
});
