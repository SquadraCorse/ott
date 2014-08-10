/* global define, AFKL */
define([
    'v2/lib/jquery',
    'v2/g-newpage',
    'v2/g-forms',
    'apps/ott/ott-utils',
    'apps/ott/ott-constants',
    'apps/ott/ott-values'
], function ($, Newpage, GForms, Utils, Constants, Values) {

    "use strict";

    var isOpen = false;
    var newPage = new Newpage({ id: 'ott' });

    newPage.on('open', function() {
        isOpen = true;
    });

    newPage.on('close', function() {
        isOpen = false;
        _eventsOff();
        Utils.trigger('ott.mail.close');
    });

    var _captcha = function () {
        var $captcha = $('#ott-captcha-img');
        var semiRandomString = new Date().getTime();
        // TODO: Constants.rootPath
        $captcha.attr('src', '//www.klm.com/commercial/ott/jcaptcha.do?#' + semiRandomString);
    };

    var _validate = function () {

        var $form = $('#ott-mailform');

        GForms.init($form, {

            submitHandler: function (form) {

                GForms.disableSubmitButton(form);

                var param = $form.serialize();
                // check why form no country value
                param += '&country=' + Values.countryCode + '&lang=' + Values.languageCode;
                
                var url = Constants.rootPath + 'mail.htm?' + param;

                $form.empty().addClass(Constants.L);

                $.ajax({
                    'url': url,
                    'type': 'POST',
                    'dataType': 'html'
                    }).done(function(data) {

                        $form.after(data);

                        $form.remove();

                        _captcha();

                        _validate();

                    })
                    .fail(function() {
                        Utils.measure('ott.error.4');
                });

            }
        });

    };

    var _eventsOn = function () {
        newPage.$el.on('click', '#ott-captcha-refresh', _captcha);
        _validate();
    };
    var _eventsOff = function () {
        newPage.$el.off('click', '#ott-captcha-refresh', _captcha);
    };

    var Mail = function (param) {

        Utils.on('ott.mail.open', function (e, arg) {
            _loadForm(arg);
        });

        var _loadForm = function (param) {

            var url = Constants.rootPath + 'mail.htm?' + param;

            $.ajax({
                'url': url,
                'dataType': 'html'
                }).done(function(data) {

                    newPage.setContent(data);

                    _captcha();

                    newPage.open();

                    _eventsOn();

                })
                .fail(function() {
                    // TODO
                })
                .always(function() {

                    AFKL.mi.push(['_measure', 'ott.search.mail']);
            });

        };


        Utils.trigger('ott.mail.open', param);


        var open = function (arg) {
            if (isOpen) { return; }
            Utils.trigger('ott.mail.open', arg);
        };

        var close = function () {
            Utils.trigger('ott.mail.close');
        };


        // PUBLIC API, WITH JQUERY EVENTBUS
        return {
            on: Utils.on,
            off: Utils.off,
            open: open,
            close: close
        };

    };

    return Mail;

});
