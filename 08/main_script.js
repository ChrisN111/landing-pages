$(document).ready(function () {
    $("span.btn").click(function () {
        $(this).closest("section").hide().next("section").fadeIn(600)
    })
});