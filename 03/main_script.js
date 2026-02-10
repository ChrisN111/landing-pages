$(document).ready(function () {

    var $items = $('.item');
    var currentSlide = 0;
    var totalSlides = $('.slider_container div').length;
    var slideInterval;

    // Next button - advance to next item
    $('.next:not(.go_reg)').click(function () {
        var $current = $(this).closest('.item');
        $current.fadeOut(300, function () {
            $current.next('.item').fadeIn(300);
        });
    });

    // Image slider rotation
    function startSlider() {
        slideInterval = setInterval(function () {
            $('.slider_container div').eq(currentSlide).fadeOut(600);
            currentSlide = (currentSlide + 1) % totalSlides;
            $('.slider_container div').eq(currentSlide).fadeIn(600);
        }, 3000);
    }

    // myFunction - called on first "Weiter" button, shows slider and hides gif
    window.myFunction = function () {
        $('#hidegif').fadeOut(300);
        $('.slider_container').fadeIn(300);
        startSlider();
    };

});
