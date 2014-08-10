define(['apps/ott/ott-values'], function (Values) {

	"use strict";

	var objTC = {

		'ott': {
			'z_application': 'OTT',
			'z_widget': 'OTT',
			'z_country': function () {
				return Values.countryCode;
			},
			'z_language': function () {
				return Values.languageCode;
			},
			'z_host': 'KL',
			'si_n': 'Online Timetable Funnel',
			'z_metron': 'False'
		},

		'ott:onload': {'z_event': 'offered'},
		'ott:onclick': {'z_event': 'clicked'},

		'ott.start': {
			'ti': 'OTT Search',
			'si_x': 1
		},

		'ott.search': {
			'ti': 'OTT Results',
			'si_x': '2',
			'si_cs': '1',
			'tx_e': 't',
			'z_origin': function() {
				return Values.origin;
			},
			'z_destination': function() {
				return Values.destination;
			},
			'z_departure_date': function() {
				return Values.outbound;
			},
			'z_return_date': function() {
				return Values.inbound;
			},
			'z_skyteam': function() {
				return Values.skyteam;
			},
			'z_trip': function() {
				return Values.trip;
			}
        },

        'ott.search.list': {
			'z_success': 'success'
        },
        'ott.search.info': {
			'z_event' : 'Clicked',
         	'z_eventtype' : 'Flight Details',
        },
        'ott.search.mail': {
			'z_event' : 'Clicked',
         	'z_eventtype' : 'Send_to_friend',
			'z_eventplace': 'Results_page'
        },
		'ott.search.error': {
			'z_error_severity': 'error',
			'z_error_errorcode': '3',
			'z_error_errordescription': 'Flight schedule could not be retrieved'
		},


		'ott.error': {
			'z_error_severity': 'error'
		},
		'ott.error.1': {
			'z_error_errorcode': '1',
			'z_error_errordescription': 'search form could not be retrieved'
		},
		'ott.error.2': {
			'z_error_errorcode': '2',
			'z_error_errordescription': 'Flight details could not be retrieved'
		},


		// ON ALL PAGES
		'ott.fare': { 'z_eventtype': 'nav_ask_link'},
	
		'ott.page.trigger': {
			'z_eventtype': 'trigger_link',
			'z_eventvalue' : function () {
				var place = this.element.getAttribute('data-ott-pos');
				return place;
			}
		},

		'ott.mail.ok': {
			'z_eventplace':	'OK page',
			'z_eventtype': 'Confirmation_container'
		}


	};


	return { 'TC': objTC };


});


/*

	this.webtrendsHashMapDashboard = [
		{'wtid':'ott-find-departure-place-link', 'wtmessage': 'Find_Departure_Airport'},
		{'wtid':'ott-find-destination-place-link', 'wtmessage': 'Find_Destination_Airport'},
		{'wtid':'ott-departure-date', 'wtmessage': 'Use_Calendar'},
		{'wtid':'cal-ott-departure-date', 'wtmessage': 'Use_Calendar_Button'},
		{'wtid':'ott-return-date', 'wtmessage': 'Use_Calendar'},
		{'wtid':'cal-ott-return-date', 'wtmessage': 'Use_Calendar_Button'},
		{'wtid':'ott-return', 'wtmessage': 'Flight_type', 'wtvalue': 'Return'},
		{'wtid':'ott-one-way', 'wtmessage': 'Flight_type', 'wtvalue': 'Oneway'}
	];

	this.webtrendsHashMapResults = [
		{'wtid':'ott-controlpanel-email', 'wtmessage': 'Send_to_friend'},
		{'wtid':'ott-controlpanel-print', 'wtmessage': 'Print'},
		{'wtid':'ott-show-other-partners', 'wtmessage': 'Sky_team'},
		{'wtid':'ott-show-direct-flights', 'wtmessage': 'Direct_flights'},
		{'wtid':'departureWeekRewind', 'wtmessage': 'Step_through_calendar', 'wtvalue': 'Down'},
		{'wtid':'departureWeekFastForward', 'wtmessage': 'Step_through_calendar', 'wtvalue': 'Up'},
		{'wtid':'arrivalWeekRewind', 'wtmessage': 'Step_through_calendar', 'wtvalue': 'Down'},
		{'wtid':'arrivalWeekFastForward', 'wtmessage': 'Step_through_calendar', 'wtvalue': 'Up'},
		{'wtid':'outbound-DEPARTURE', 'wtmessage': 'Change_Sort_Order', 'wtvalue': 'Departure'},
		{'wtid':'outbound-ARRIVAL', 'wtmessage': 'Change_Sort_Order', 'wtvalue': 'Arrival'},
		{'wtid':'outbound-DURATION', 'wtmessage': 'Change_Sort_Order', 'wtvalue': 'Duration'},
		{'wtid':'outbound-TRANSFER', 'wtmessage': 'Change_Sort_Order', 'wtvalue': 'Transfer'},
		{'wtid':'inbound-DEPARTURE', 'wtmessage': 'Change_Sort_Order', 'wtvalue': 'Departure'},
		{'wtid':'inbound-ARRIVAL', 'wtmessage': 'Change_Sort_Order', 'wtvalue': 'Arrival'},
		{'wtid':'inbound-DURATION', 'wtmessage': 'Change_Sort_Order', 'wtvalue': 'Duration'},
		{'wtid':'inbound-TRANSFER', 'wtmessage': 'Change_Sort_Order', 'wtvalue': 'Transfer'},
		{'wtid':'ott-book-flight-submit', 'wtmessage': 'Check_availability'}
	];


	"z_application" : "OTT",
	"z_event" : "Clicked",
	"z_eventtype" : strEvent,
	"z_eventplace" : that.getWebtrendsEventPlace(),
	"z_metron" : "False"


	"z_application" : "OTT",
	"z_event" : "Clicked",
	"z_eventtype" : strEvent,
	"z_eventvalue" : strValue,
	"z_eventplace" : that.getWebtrendsEventPlace(),
	"z_metron" : "False"

 */