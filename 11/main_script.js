$(document).ready(function () {
    function pageScroll(distance) {
        $("html, body").animate({
            scrollTop: distance
        }, 1000);
    }
    setTimeout(pageScroll($(document).height()), 2000);
    $('.btn').on('click', function () {
        $(this).closest('.step').hide().next('.step').fadeIn();
        pageScroll(200);
    });
    $('.option').on('click', function () {
        $(this).toggleClass('checked tr-selected');
    });
});