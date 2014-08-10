
// OTT MAIN MODULE
define([
    'v2/lib/jquery',
    'v2/g-mi',
    'v2/g-window-events',
    'apps/ott/ott-search',
    'apps/ott/ott-scroll',
    'apps/ott/ott-constants',
    'apps/ott/ott-values',
    'apps/ott/ott-utils',
    'apps/ott/ott-analytics'
], function ($, $mi, $windowEvents, Search, Scroll, Constants, Values, Utils, $analytics) {

    "use strict";

    // OTT MODULES
    var SearchInstance;
    var ScrollInstance;
    var MailInstance;

    // CONFIG
    var $wrapper = Constants.$wrapper;
    var query = {}; // LOCATION SEARCH PARAMS
    var collection = {}; // SORTING ON FLIGHT LIST


    // BACKEND GIVES OUR SORTABLE OBJECTS IN OUR HTML (FUGLY)
    var _sortingOptions = function () {

        collection.outbound = $.parseJSON($('#ott-data-outbound').html());
        collection.inbound = $.parseJSON($('#ott-data-inbound').html());

    };


    // SORT ON: ARRIVAL, DEPARTURE, DEFAULT, DURATION, FLIGHT
    var _doSort = function () {
        var $this = $(this);

        var type = $this.attr('data-type');
        if (!type) { return; }

        var sort = $this.find('option:selected').attr('data-type');
        var data = collection[type][sort];

        if (!data) { return; }

        var $flights = $('#ott-' + type);
        var list = [];

        // SORTING IS UP
        for (var i = 0, l = data.length; i < l; i++) {
            var item = $flights.find('li[data-id="' + data[i] + '"]')[0].outerHTML; // innerhtml and container itself
            list.push(item);
        }

        // IF WE HAVE A LIST CHANGE OUR DOM
        if (list.length) {
            $flights.empty().append(list.join(' '));
        }

    };


    // LOAD FLIGHTS: GIVE ALL AVAILABLE FLIGHTS BASED ON OUR SEARCHFORM OR QUERYSTRING
    var _loadFlights = function (param) {

        var url = Constants.rootPath + 'ttr.htm?' + param;

        $wrapper.empty();
        $wrapper.addClass(Constants.L);

        $.ajax({
            'url': url,
            'dataType': 'html'
            }).done(function(data) {

                $wrapper.append(data);

                // new data so new sorting collections
                _sortingOptions();

                Utils.measure('ott.search.list');
            })
            .fail(function() {
                Utils.measure('ott.search.error');
            })
            .always(function() {
                $wrapper.removeClass(Constants.L);
                ScrollInstance.update();
                ScrollInstance.calculate();
                ScrollInstance.scrollIntoView();
        });

    };


    // LOAD FLIGHT DETAILS: LOAD FLIGHT DETAILS PER CONNECTION ONCE
    var _loadFlightInfo = function ($item) {
        var data = $item.data();

        // GET AJAX CONTENT ONCE
        if (!data.loaded) {
            data.loaded = true;

            var $info = $item.find('.ott-flight-info');
            $info.addClass(Constants.L);

            var param = data.json;
            var url = Constants.rootPath + 'ttrd.htm?' + param;

            $.ajax({
                'url': url,
                'dataType': 'html'
                }).done(function(data) {
                    $info.append(data);
                })
                .fail(function() {
                    Utils.measure('ott.error.2');
                })
                .always(function() {
                    $info.removeClass(Constants.L);
                    ScrollInstance.calculate();
            });

        } else {
            ScrollInstance.calculate();
        }
    };



    // EVENTS
    var _events = function() {
        
        // Click on collapse button
        $wrapper.on('click', '.ott-collapse', function (event) {
            event.preventDefault();
            event.stopPropagation();

            var $this = $(this).closest('.ott-fare');
            $this.toggleClass(Constants.FS);

            _loadFlightInfo($this);

        });

        // Click on a fare: get content
        $wrapper.on('click', '.ott-fare', function () {

            var $this = $(this);
            $this.addClass(Constants.FS);

            _loadFlightInfo($this);

        });

        // SELECT SPECIFIC FLIGHT/DAY
        $wrapper.on('click', '.ott-flight-radio', function (event) {
            var $this = $(event.target);
            var value = $(this).val();
            var $connection = $this.closest('.ott-connection');

            var type = $connection.attr('data-connection');
            var date = $connection.find('.ott-connection-header [data-day="' + value + '"]').attr('data-date');
            
            // UPDATE SELECTED DATE
            if (type === 'outbound') {
                Values.outbound = date;
            } else {
                Values.inbound = date;
            }

            $('.js-ott-form-mail').removeClass(Constants.D);

        });


        // NAV: NEXT PREVIOUS WEEK
        Constants.$body.on('click', '.ott-nav', function (event) {
            event.preventDefault();
            event.stopPropagation();

            var param = $(this).attr('data-json');
            _loadFlights(param);

        });


        // SORTING DIRECTIONS
        $wrapper.on('change', '.js-ott-sort', _doSort);


        // PRINT PAGE
        $wrapper.on('click', '.js-ott-form-print', function (event) {
            event.preventDefault();
            window.print();
        });


        // MAIL A FRIEND MODULE
        var mailHold = false;
        $wrapper.on('click', '.js-ott-form-mail', function (event) {
            event.preventDefault();

            // MONKEY CLICK PREVENTING
            if (mailHold) { return; }
            mailHold = true;

            // MAKE SURE OUR SCROLLING ITEM DOESN'T POPUP
            ScrollInstance.scrollOff();

            // http://www.klm.com/commercial/ott/mail.htm?lang=nl&country=nl&depdate=2014-08-12&retdate=2014-08-17
            // TODO: HOW DOES IT KNOW WHICH FLIGHTS I SELECTED ???
            var param = 'lang=' + Values.languageCode + '&country=' + Values.countryCode +
                '&depdate=' + Values.outbound + '&retdate=' + Values.inbound;

            // LOAD API ONCE
            if (!MailInstance) {
                require(['apps/ott/ott-mail'], function (Mail) {

                    MailInstance = new Mail(param);
                    MailInstance.on('ott.mail.open', ScrollInstance.scrollOff);
                    MailInstance.on('ott.mail.close', ScrollInstance.scrollOn);

                    mailHold = false;

                });
            } else {
                MailInstance.open(param);
                mailHold = false;
            }

        });

        // BOOK FLIGHT
        // http://www.klm.com/travel/nl_nl/apps/ebt/ebt_home.htm?goToPage=home_return&c[0].os=AMS&c[0].ds=JFK&c[1].os=JFK&c[1].ds=AMS&c[0].dd=2014-08-13&c[1].dd=2014-08-16&WT.seg_4=OTT_EBT
        $wrapper.on('click', '#ott-book', function () {
            var url = $(this).attr('data-ebt');
            url += '&WT.seg_4=OTT_EBT';

            if (window.console) { window.console.log(Values, url); }

        });

        // SCROLL TO TOP
        $wrapper.on('click', '.js-ott-scroll-top', function () {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        });

        // DO SEARCH
        SearchInstance.on('ott.search', function (e, arg) {

            // UPDATE URL (WHEN USER REFRESHES)
            if (history && history.pushState) {
                var url = window.location.pathname;
                var filename = url.substring(url.lastIndexOf('/') + 1);
                filename += '?' + $.param(arg);
                history.pushState({}, '', filename);
            }

            // LOAD OUR ITINERARY INFORMATION
            _loadFlights($.param(arg));

        });

    };

    // ANALYTICS PART
    var _analytics = function () {
        // ADD OUR DEFINITIONS
        $mi.add($analytics);
        // OUR APP IS LOADED, SEND EVENT TO MI
        Utils.measure('ott.start');
    };


    // OTT: MODULE INITIALISATION
    var _init = function () {

        SearchInstance = new Search(query);
        ScrollInstance = new Scroll();

        _events();

        _analytics();

        // IF WE SEE AN USEFUL QUERYPARAMETER THEN KICKSTART OUR APPLICATION (MAILINGS CAN SEND DIRECT LINKS)
        if (query.depdate) {
            _loadFlights($.param(query));
        }

    };



    /* PUBLIC API */
    // Load our searchform and kickstart our app
    // cntry=nl&lang=nl&org=AMS&dest=JFK&depdate=2014-08-15&retdate=2014-08-16&dp=yyyy-MM-dd&sky=n&drct=n&country=nl&lang=nl&dl=fd
    var init = function ($el) {

        // DID WE GET STARTED FROM AN URL?
        var hash;
        var q = decodeURIComponent(window.location.search.substring(1));

        if (q !== 'undefined') {
            q = q.split('&');
            for (var i = 0, l = q.length; i < l; i++){
                hash = q[i].split('=');
                // value max 10 chars to be 'safe' from manipulation
                if (hash[1]) {
                    query[hash[0]] = hash[1].substr(0, 10);
                }
            }
        }

        // START SEARCH ITENARY WIDGET
        if (query.country) { Values.countryCode = query.country; }
        if (query.lang) { Values.languageCode = query.lang; }

        var url = Constants.rootPath + 'dashboard.htm?db=f&lang=' + Values.languageCode +'&country=' + Values.countryCode;

        $.ajax({
            'url': url,
            'dataType': 'html'
            }).done(function(data) {
                // set our search html
                $el.append(data);
                // start our app
                _init();
            })
            .fail(function() {
                Utils.measure('ott.error.1');
            })
            .always(function() {
                $el.removeClass(Constants.L);
        });

    };

    return {
        'init': init
    };

});
