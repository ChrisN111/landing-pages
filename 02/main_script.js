$(document).ready(function () {

    var current = 0;
    var $slideBg = $('.preload_images span');

    function bgChange() {
        $slideBg.removeClass('active').eq(current).addClass('active');
        if (current < 1) {
            current++;
        } else {
            current = 0;
        }
    }
    bgChange();

    $(".btn:not('.finalBtn')").click(function () {
        $(this).closest('.step').hide().next('.step').fadeIn();
        if ($(this).hasClass('start_animation')) {
            $('body').addClass('active');
            $('.preload_images').fadeIn();
            setInterval(bgChange, 6000);
        }
    });

    $('.checkbox_item').click(function () {
        $(this).toggleClass('checked');
    });

});