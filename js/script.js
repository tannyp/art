//Navbar Toggle
function copyToC() {
    var copyText =  document.getElementById('a1').innerHTML;

   document.addEventListener('copy', function(e) {
      e.clipboardData.setData('text/plain', copyText);
      e.preventDefault();
   }, true);

   document.execCommand('copy');  
   console.log('copied text : ', copyText);
   alert('copied text: ' + copyText); 
}

$('.navbar-toggle').click(function(){
  if( $(this).hasClass('collapsed') ){
    $(this).removeClass('collapsed');
  }else{
    $(this).addClass('collapsed');
  }
 })
   
 // Carousel Auto-Cycle
 $(document).ready(function() {
    $('.carousel').carousel({
      interval: 0
    })
    
    
    
  });
// Back to top Arrow
 
 jQuery(document).ready(function($){
	// browser window scroll (in pixels) after which the "back to top" link is shown
	var offset = 300,
		//browser window scroll (in pixels) after which the "back to top" link opacity is reduced
		offset_opacity = 1200,
		//duration of the top scrolling animation (in ms)
		scroll_top_duration = 700,
		//grab the "back to top" link
		$back_to_top = $('.cd-top, .top');

	//hide or show the "back to top" link
	$(window).scroll(function(){d
		( $(this).scrollTop() > offset ) ? $back_to_top.addClass('cd-is-visible') : $back_to_top.removeClass('cd-is-visible cd-fade-out');
		if( $(this).scrollTop() > offset_opacity ) { 
			$back_to_top.addClass('cd-fade-out');
		}
	});

	//smooth scroll to top
	$back_to_top.on('click', function(event){
		event.preventDefault();
		$('body,html').animate({
			scrollTop: 0 ,
		 	}, scroll_top_duration
		);
	});

	

});


// handle links with @href started with '#' only
$(document).on('click', 'a[href^="#"]', function(e) {
    // target element id
    var id = $(this).attr('href');

    // target element
    var $id = $(id);
    if ($id.length === 0) {
        return;
    }

    // prevent standard hash navigation (avoid blinking in IE)
    e.preventDefault();

    // top position relative to the document
    var pos = $(id).offset().top;

    // animated top scrolling
    $('body, html').animate({scrollTop: pos});
});

// 3D Carousel
document.addEventListener('DOMContentLoaded', function() {
    function initCarousel(carouselId) {
        const carousel = document.getElementById(carouselId);
        const items = carousel.getElementsByClassName('carousel-3d-item');
        const totalItems = items.length;
        let currentIndex = 2; // Start with middle image (index 2 for 5 images)

        function mod(n, m) {
            return ((n % m) + m) % m;
        }

        function updateCarousel() {
            // First, hide all images
            for(let i = 0; i < totalItems; i++) {
                items[i].style.display = 'none';
                items[i].style.pointerEvents = 'none';
            }

            // Calculate indices for left, center, and right images
            const leftIndex = mod(currentIndex - 1, totalItems);
            const centerIndex = currentIndex;
            const rightIndex = mod(currentIndex + 1, totalItems);

            // Show and position only the three visible images
            const visibleIndices = [leftIndex, centerIndex, rightIndex];
            
            visibleIndices.forEach((index, position) => {
                const item = items[index];
                item.style.display = 'block';
                
                // Position: -1 for left, 0 for center, 1 for right
                const offset = position - 1;
                
                const x = offset * 280; // Adjust spacing between images
                const z = Math.abs(offset) * -100;
                const scale = Math.max(0.8, 1 - Math.abs(offset) * 0.2);
                const opacity = Math.max(0.6, 1 - Math.abs(offset) * 0.3);
                
                item.style.transform = `translate3d(${x}px, 0, ${z}px) scale(${scale})`;
                item.style.opacity = opacity;
                item.style.zIndex = 1000 - Math.abs(offset);
                
                // Enable clicking only on side images
                if (offset !== 0) {
                    item.style.pointerEvents = 'auto';
                    item.style.cursor = 'pointer';
                }
            });
        }

        // Initial setup
        updateCarousel();

        // Click handlers for items
        for(let i = 0; i < items.length; i++) {
            items[i].addEventListener('click', () => {
                // When clicking left image
                if (i === mod(currentIndex - 1, totalItems)) {
                    currentIndex = mod(currentIndex - 1, totalItems);
                    updateCarousel();
                }
                // When clicking right image
                else if (i === mod(currentIndex + 1, totalItems)) {
                    currentIndex = mod(currentIndex + 1, totalItems);
                    updateCarousel();
                }
            });
        }

        // Touch swipe support
        let touchStartX = 0;
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        carousel.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > 50) { // Minimum swipe distance
                if (diff > 0) {
                    currentIndex = mod(currentIndex + 1, totalItems);
                } else {
                    currentIndex = mod(currentIndex - 1, totalItems);
                }
                updateCarousel();
            }
        });
    }

    // Initialize all carousels
    initCarousel('carousel-1');
    initCarousel('carousel-2');
    initCarousel('carousel-3');
});


 

