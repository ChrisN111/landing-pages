const images = document.querySelectorAll(".myimgs");

images.forEach(image => {
  image.addEventListener("click", () => {
    image.classList.toggle("highlight");
  });
});

const ims = document.querySelectorAll(".myimgs");

ims.forEach(image => {
  image.addEventListener("click", () => {
    image.classList.toggle("highlight");
  });
});


$(document).ready(function () {

  $('.option').on('click', function () {
    $(this).toggleClass('checked tr-selected');
  });

  var $btnNext = $('.step-btn');
  var currentStep = 0;
  var $step = $('.step-item');

  $btnNext.not('.submit-btn').on('click', function () {
    currentStep++;
    $step.hide().eq(currentStep).fadeIn();
  });

  $('.checkbox-item').on('click', function () {
    $(this).toggleClass('checked tr-selected');
  });

  var $loaderOverlay = $('.loader-overlay');
  $('.popup-btn').on('click', function () {
    $(this).closest('.popup-block').hide();
    $loaderOverlay.fadeIn();
    setTimeout(function () {
      $loaderOverlay.fadeOut();
      $('.step-block').fadeIn();
    }, 2500);
  });

});