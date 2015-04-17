'use strict';

/* App Module */

var roadtrippersApp = angular.module('roadtrippersApp', ['yaMap', 'uiSlider', 'slick', 'ngRoute', 'ui.bootstrap', 'ngTagsInput']);

roadtrippersApp.config([ 'yaMapSettingsProvider', '$routeProvider',
    function (yaMapSettings, $routeProvider) {

        yaMapSettings.setOrder('latlong');
        $routeProvider.
            when('/', {
                templateUrl: '/static/app/partials/index.html',
                controller: 'CardCtrl'
            })
    }
]);
