function goToStep(e, t) {
    "function" == typeof handleBeforeGoNextStep && handleBeforeGoNextStep(e, t);
    var u = "hidden";
    e.hasClass("step-hidden") && (u = "step-hidden"), e.removeClass("hidden step-hidden"), t.addClass(u), t.find("input").blur(), activeProgressBar(e), countdownToNextStep(e), "function" == typeof handleAfterGoNextStep && handleAfterGoNextStep(e, t)
}

function countdownToNextStep(e) {
    var t = e.attr("data-timeout");
    e.hasClass("js-animation-step") && void 0 !== t && setTimeout(function () {
        goToStep(e.next(".js-step"), e)
    }, t)
}

function activeProgressBar(e) {
    var t = e.closest(".registration-form-builder").find(".js-progress-bar");
    0 < t.length && (e = e.parent().find(".js-step").index(e), t.find("li").removeClass("active").eq(e).addClass("active visited"))
}


$(function () {
    $(".js-step .js-next-step").on("click", function () {
        var e = $(this).closest(".js-step"),
            t = e.next(".js-step");
        goToStep(t, e)
    });
});

$(function () {
    var $backgroundLC = $('.background-lc'),
        $backgroundPT = $('.background-pt');

    aniFade($backgroundLC);

    $backgroundPT.each(function (index) {
        aniFade($(this));
    });

    $('.js-animation').on('click', function () {
        var $processingBar = $('.js-processing-bar'),
            timeout = $processingBar.attr('data-timeout'),
            percent = 0,
            $processingEle = $processingBar.find('span'),
            $processingButton = $('.processing-bar-step').find('.btn'),
            $processingTexts = $('.js-animation-texts');

        //processing texts
        var totalTexts = $processingTexts.find('li').length
        index = 0;
        var processingTexts = setInterval(function () {
            ++index;
            $processingTexts.find('li').removeClass('active').eq(index).addClass('active');
            if (index >= totalTexts) {
                clearInterval(processingTexts);
            }
        }, timeout / totalTexts);

        var processingTimer = setInterval(function () {
            percent++;
            $processingEle.css({
                'width': percent + '%'
            });
            if (percent >= 100) {
                clearInterval(processingTimer);
                $processingButton.trigger('click');
            }
        }, timeout / 100);
    });

    $('.js-select-list li').on('click', function () {
        var countSelected = $(this).parent().find('li.active').length;
        if (countSelected >= 3 && !$(this).hasClass('active')) {
            return false;
        }

        $(this).toggleClass('active');

        $(this).parent().siblings('footer').find('button').prop('disabled', $(this).parent().find('li.active').length == 0 ? true : false);
    });

    var numRandom = Math.floor(Math.random() * (400 - 150) + 150);
    $('.js-num').html(numRandom);
});

async function aniFade(ele) {

    var length = ele.find('.img-wrapper').length,
        run = 0;
    let flagVideo = true;

    ele.find('.img-wrapper').eq(0).addClass('fade-in').removeClass('fade-out');
    await LoadVideo(ele.find('.img-wrapper').eq(0), run);
}

function LoadVideo($ele, num) {
    let isVideo = $ele.eq(0).find('video').length;
    if (isVideo > 0) {
        $ele.eq(num).find('video').each(function (i) {
            let videoFile = $(this).data('src');
            $(this).eq(0).find('source').eq(0).attr('src', videoFile);
            $(this)[0].load();
        });
    }
}