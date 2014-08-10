define([
    'v2/lib/jquery',
    'v2/g-locationpicker',
    'v2/g-datepicker',
    'apps/ott/ott-constants',
    'apps/ott/ott-values',
    'apps/ott/ott-utils'
], function ($, LocationPicker, DatePicker, Constants, Values, Utils) {

    "use strict";

    var country = Values.countryCode;
    var language = Values.languageCode;


    var Search = function (query) {
        // cntry=nl&lang=nl&org=AMS&dest=JFK&depdate=2014-08-15&retdate=2014-08-16&dp=yyyy-MM-dd&sky=n&drct=n&country=nl&lang=nl&dl=fd

        var $button = $('.js-ott-show-flights');
        var origin;
        var destination;

        var _checkInput = function() {
            if (!origin || !destination) { 
                $button.addClass(Constants.BD);
                return false;
            } else {
                $button.removeClass(Constants.BD);
                return true;
            }
        };

        var today = new Date();
        var departure = (new Date()).setDate(today.getDate() + 7);
        var arrival = (new Date()).setDate(today.getDate() + 14);
        var max = (new Date()).setDate(today.getDate() + 347);


        // Transfrom dates into pretty dates for our Instances
        var min = Utils.prettyDate(today);
        max = Utils.prettyDate(max);

        departure = query.depdate || Utils.prettyDate(departure);
        arrival = query.retdate || Utils.prettyDate(arrival);

        var originParam = {
            country: country,
            language: language,
            application: 'ott',
            container: '.ott-form-origin',
            type: 'origin'
        };
        if (query.org) { originParam.prefill = { 'code': query.org, 'type': 'AIRPORT'}; origin = query.org; }

        var destinationParam = {
            country: country,
            language: language,
            application: 'ott',
            container: '.ott-form-destination',
            type: 'destination'
        };
        if (query.dest) { destinationParam.prefill = { 'code': query.dest, 'type': 'AIRPORT'}; destination = query.dest; }


        // LOCATIONS
        var originAutoComplete = new LocationPicker(originParam);
        originAutoComplete.on('selected', function(item) {
            origin = item.code;
            _checkInput();
        });

        var destinationAutoComplete = new LocationPicker(destinationParam);
        destinationAutoComplete.on('selected', function(item) {
            destination = item.code;
            _checkInput();
        });

        // DATES
        var departureDatepicker = new DatePicker({
            type                : 'date',
            container           : '.ott-form-departure',
            firstWeekDay        : 1,
            minDate             : min,
            maxDate             : max,
            dateFormatLong      : 'EEEE d MMMM yyyy',
            startDate           : departure
        });

        var arrivalDatepicker = new DatePicker({
            type                : 'date',
            container           : '.ott-form-arrival',
            firstWeekDay        : 1,
            minDate             : min,
            maxDate             : max,
            // daysToLatestReturn  : 347,
            dateFormatLong      : 'EEEE d MMMM yyyy',
            startDate           : arrival
        });

        departureDatepicker.on('selected', function(e, arg) {

            arrivalDatepicker.minDate(arg.date);
            departure = arg.date;

            // IS THIS DATE LARGER THEN NEXT INPUT FIELD DATE?
            var date2 = arrivalDatepicker.get();
            if (date2 && arg.dateTime > date2.dateTime) {
                arrivalDatepicker.set(arg.date);
            }

        });

        arrivalDatepicker.on('selected', function(e, arg) {
            arrival = arg.date;
        });


        // DO SEARCH
        var _searchFlights = function () {

            // Update our values
            Values.outbound = departure;
            Values.inbound = arrival;
            Values.origin = origin;
            Values.destination = destination;

            // parameters for new flights
            var param = {
                'depdate': departure,
                'retdate': arrival,
                'org': origin,
                'dest': destination,
                'sky': Values.skyteam,
                'drct': Values.direct,
                'country': Values.countryCode,
                'language': Values.languageCode,
                'dp': 'yyyy-MM-dd'
            };

            // Oneway or return
            var oneway = $('[name="ott-form-type"]:checked').val();
            if (oneway === 'oneway') {
                param.oneway = 'true';
                Values.trip = 'OW';
            } else {
                Values.trip = 'RT';
            }

            var skyteam = $('.js-ott-form-skyteam').is(':checked');
            if (skyteam) { param.sky = 'y'; Values.skyteam = 'y'; }

            var direct = $('.js-ott-form-direct').is(':checked');
            if (direct) { param.drct = 'y'; Values.direct = 'y'; }

            // DO SEARCH
            Utils.trigger('ott.search', param);

        };


        /* CLICK: DIRECT FLIGHT OR SKYTEAM ONLY */
        Constants.$wrapper.on('click', '.js-ott-form-skyteam, .js-ott-form-direct', function (event) {
            event.preventDefault();
            _searchFlights();
        });

        /* CLICK: SHOW ALL FLIGHTS FOR ITINERARY */
        $('.js-ott-show-flights').on('click', function (event) {
            event.preventDefault();
            if (!origin || !destination) { return; }

            _searchFlights();

        });

        // TYPE OF ITENARY
        $('[name="ott-form-type"]').on('click', function () {
            var value = $(this).val();
            var $input = $('#ott-form-arrival');

            if (value === 'oneway') {
                $input.addClass(Constants.FD);
                $input.prop('disabled', true);
            } else {
                $input.removeClass(Constants.FD);
                $input.prop('disabled', false);
            }
        });


        _checkInput();


        // PUBLIC API, WITH JQUERY EVENTBUS
        return {
            on: Utils.on
        };


    };

    return Search;

});
