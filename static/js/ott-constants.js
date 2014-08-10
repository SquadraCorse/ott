define(['v2/lib/jquery'], function ($) {

    "use strict";

    return {
        rootPath: './static/api/', // '/commercial/ott/';
        $window: $(window),
        $document: $(document),
        $body: $('body'),
        $wrapper: $('.ott-wrapper'),
        $sticky: $('<div class="ott-sticky-scroll"><div class="g-grid--row"><div class="g-grid--span12"></div></div></div>'),
        L: 'g-loading-large',
        D: 'ott-disabled',
        FS: 'ott-fare-selected',
        BD: 'g-btn-disabled',
        FD: 'g-forms-disabled'
    };

});