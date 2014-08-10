define([
    'v2/lib/jquery',
    'v2/g-window-events',
    'apps/ott/ott-constants'

    /**
     * Make headers sticky when scrolling
     * @exports ott-scroll
     * @requires v2/lib/jquery
     * @requires v2/g-window-events
     */

], function ($, $windowEvents, Constants) {

    "use strict";

    /* CONFIG */
    var $wrapper = Constants.$wrapper; // wrapper containing whole list of connections
    // Constants.$sticky // our sticky shadow container
    var HEADER = '.ott-connection-header'; // our sticky headers inside our scrolling wrapper


    /* MODULE VARS */
    var $headers = null; // OBJECT CONTAINING ALL HEADERS
    var headersReverse = null; // OUR HEADERS IN REVERSE ORDER

    var currentStickyHeader = null;
    var currentGhost = null;
    var currentScrollPosition = 0;
    var currentScrollItem;
    var wrapperPosition = 0;
    var wrapperHeight = 0;
    var lastHeaderHeight = 0;


    /**
     * OTT MODULE: Scrolling Instance
     */
    var Scroll = function () {


        /**
         * Fill our sticky with the active header
         * @param  {string} header    InnerHTML of our header
         * @param  {number} topOffset Position alignment on top
         */
        var createGhostHeader = function (header, topOffset) {

            // Set up position of fixed row
            Constants.$sticky.css({
                top: -topOffset
            });

            // Create a deep copy of our actual header and put it in our container
            Constants.$sticky.find('.g-grid--span12').empty().html($(header).clone());
            Constants.$sticky.show();

            currentGhost = Constants.$sticky;
            currentStickyHeader = header;

        };


        /**
         * On resize re-calculate our new heights
         */
        var _onResize = function() {
            calculateHeights();
        };


        /**
         * When we scroll we do our sticky stuff
         * position off closest header in top
         */
        var _onScroll = function() {

            var currentScrollTop = Constants.$document.scrollTop();
            var activeHeader = null;
            var topOffset = 0;

            if (currentScrollTop === currentScrollPosition) { return; }
            currentScrollPosition = currentScrollTop;


            // CHECK: Is wrapper visible and does it have space for our header
            if (wrapperPosition.top + wrapperHeight - lastHeaderHeight >= currentScrollTop) {

                var lastCheckedHeader = null;

                // REVERSE: Get our last good header
                headersReverse.each(function (i) {

                    var position = $(this).offset();
                    if (position.top <= currentScrollTop) {
                        activeHeader = this;
                        currentScrollItem = i;
                        return false;
                    }

                    lastCheckedHeader = this;

                });

                if (lastCheckedHeader) {
                    var offset = $(lastCheckedHeader).offset();
                    var height = $(activeHeader).outerHeight();

                    if (offset.top - currentScrollTop < height) {
                        topOffset = height - (offset.top - currentScrollTop) + 1;
                    }
                }
            }

            // No row is needed, get rid of one if there is one
            if (activeHeader === null && currentGhost) {
                currentGhost.hide();
                currentGhost = null;
                currentStickyHeader = null;
            }
            
            // We have what we need, make a fixed header row
            // Same as current, do nothing
            if (activeHeader && activeHeader === currentStickyHeader && currentGhost) {
                currentGhost.css('top', -topOffset + 'px');
            } else if (activeHeader) {
                createGhostHeader(activeHeader, topOffset);
            }

        };


        /**
         * Scroll new/current header into our view to current one
         * Notice: ONLY WORKS IF HEADERS ITSELF STAY THE SAME
         * @param  {number} arg Active header item number in reverse order
         */
        var scrollIntoView = function (arg) {

            var pos = wrapperPosition.top;
            // USER CAN HAVE INFLUENCE WHERE TO SCROLL
            var itemNumber = arg ? arg : currentScrollItem ? currentScrollItem : null;

            // SCROLL TO ACTIVE HEADER
            if (itemNumber) {
                var item = headersReverse[itemNumber];
                if (item) { 
                    pos = $(item).offset().top + 1;
                }

            }

            // Do animate
            $('html, body').animate({
                scrollTop: pos
            }, 600);

        };

        /**
         * Activate all our events
         */
        var scrollOn = function() {
            Constants.$window.on({
                'touchmove': _onScroll,
                'scroll': _onScroll
            });

            $windowEvents.onResize(_onResize);
        };

        /**
         * De-activate all our events
         */
        var scrollOff = function() {
            Constants.$window.off({
                'touchmove': _onScroll,
                'scroll': _onScroll
            });

            $windowEvents.offResize(_onResize);
        };

        /**
         * New html is placed in our wrapper, set our default vars
         */
        var newElements = function() {
            $headers = $wrapper.find(HEADER);
            headersReverse = $($headers.get().reverse());
        };

        /**
         * Calculate positions and height for our module
         */
        var calculateHeights = function() {
            wrapperPosition = $wrapper.offset();
            wrapperHeight = $wrapper.height();
            lastHeaderHeight = $headers.last().outerHeight();
        };

        /**
         * Our Sticky scrolling app bootstrap
         */
        var _init = function() {
            Constants.$sticky.hide();
            // APPLY OUR HIDDEN STICKY CONTAINER TO OUR DOM
            Constants.$body.append(Constants.$sticky);
            // LISTEN TO SCROLLING BEHAVIOUR
            scrollOn();
        };

        // START OUR APP
        _init();

        // PUBLIC API
        return {
            scrollOn: scrollOn,
            scrollOff: scrollOff,
            scrollIntoView: scrollIntoView, // Start with main list or when connection info is updated
            update: newElements, // When user sets new data inside our wrapper
            calculate: calculateHeights // When user expands our wrapper height (toggling info for example)
        };

    };

    return Scroll;

});
