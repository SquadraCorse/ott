/* global KLM */
define([], function () {

    "use strict";

    return {
        origin: 'xxx',
        destination: 'xxx',
        outbound: 'xxxx-xx-xx',
        inbound: 'xxxx-xx-xx',
        trip: 'xx',
        skyteam: 'n',
        direct: 'n',
        countryCode: (KLM.klmcom && KLM.klmcom.configuration && KLM.klmcom.configuration.countryCode) || window.countryCode ? window.countryCode : 'nl',
        languageCode: (KLM.klmcom && KLM.klmcom.configuration && KLM.klmcom.configuration.languageCode) || window.languageCode ? window.languageCode : 'en',
        date: 'yyyy-MM-dd'
    };

});