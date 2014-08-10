var AFKL = AFKL || {};
AFKL.mi = AFKL.mi || {};

define([
    'v2/lib/jquery',
], function ($) {

    "use strict";

    var $eventBus = $({});

    var Utils = function () {

	    var trigger = function () {
	        $eventBus.triggerHandler.apply($eventBus, arguments);
	    };

	    var on = function () {
	        $eventBus.on.apply($eventBus, arguments);
	    };

	    var off = function () {
	        $eventBus.off.apply($eventBus, arguments);
	    };

	    var prettyDate = function (timestamp) {
	        var date = new Date(timestamp);
	        var yyyy = date.getFullYear();
	        var mm = (date.getMonth() + 1).toString();
	        var dd  = date.getDate().toString();
	                        
	        return yyyy + '-' + (mm[1] ? mm : '0' + mm[0]) + '-' + (dd[1] ? dd : '0' + dd[0]);
	    };

	    var measure = function (key) {
	    	AFKL.mi.push(['_measure', key]);
	    };

	    return {
	    	$eventBus: $eventBus,
	    	trigger: trigger,
	    	on: on,
	    	off: off,
	    	prettyDate: prettyDate,
	    	measure: measure
	    };

	};

	return new Utils();

});
