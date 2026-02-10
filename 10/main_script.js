$(document).ready(function () {

    var e = $(".step-btn");
    var c = 0;
    var a = $(".step-item");

    e.not(".submit-btn").on("click", function () {
        c++;
        a.hide().eq(c).fadeIn()
    });
    $(".checkbox-item").on("click", function () {
        $(this).toggleClass("checked tr-selected")
    });
    var d = $(".loader-overlay");
    $(".popup-btn").on("click", function () {
        $(this).closest(".popup-block").hide();
        d.fadeIn();
        setTimeout(function () {
            d.fadeOut();
            $(".step-block").fadeIn()
        }, 2500)
    });

});