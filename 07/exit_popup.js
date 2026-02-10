var ExitIntentLayer = function (options) {
    let defaults = {
        layerShown: false,
    };
    let settings = $.extend({}, defaults, options);
    this.layerShown = settings.layerShown;
}
ExitIntentLayer.prototype.applyLanguage = function (translations) {
    if (typeof translations !== 'undefined') {
        var userLang = navigator.language || navigator.userLanguage,
            langCode = userLang.split('-')[0],
            lang = langCode ? langCode : 'default',
            langSet = translations[lang];
        $('.apply-lg').each(function () {
            var thisTxt = $(this),
                thisLg = thisTxt.data('lg');
            thisTxt.html(langSet[thisLg]);
        });
    }
};
ExitIntentLayer.prototype.open = function () {
    $('.exit-intent .overlay').removeClass('hidden');
    $('.exit-intent .layer-wrapper').removeClass('hidden');
    if (!this.layerShown)
        this.countDown();
};
ExitIntentLayer.prototype.close = function () {
    $('.exit-intent .overlay').addClass('hidden');
};
ExitIntentLayer.prototype.countDown = function () {
    this.layerShown = true;
    var _this = this;
    var $minute = $('.exit-intent .exit-cd-timer .exit-cd-minute').eq(0),
        $second = $('.exit-intent .exit-cd-timer .exit-cd-second').eq(0);
    var countDownTimer = setInterval(function () {
        var minute = parseInt($minute.text()),
            second = parseInt($second.text());
        if (minute <= 0 && second <= 1) {
            clearInterval(countDownTimer);
        } else if (second <= 0) {
            $minute.text(_this.pad(minute - 1, 2));
            second = 60;
        }
        if (minute >= 0 && second > 0)
            $second.text(_this.pad(second - 1, 2));
    }, 1000);
};
ExitIntentLayer.prototype.pad = function (n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

window.addEventListener("load", function () {
    var exitIntentLayer = new ExitIntentLayer({});
    $(document).ready(function () {
        $('.exit-intent .open-layer').click(function () {
            exitIntentLayer.open();
        });
        $('.exit-intent .close-layer').click(function () {
            exitIntentLayer.close();
        });
    });
});