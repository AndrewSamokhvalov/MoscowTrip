'use strict';

/* App Module */

var roadtrippersApp = angular.module('roadtrippersApp', ['yaMap','uiSlider','slick']);


roadtrippersApp.config(['$interpolateProvider','yaMapSettingsProvider',
    function($interpolateProvider,yaMapSettings) {
        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');
        yaMapSettings.setOrder('latlong');
    }
]);

