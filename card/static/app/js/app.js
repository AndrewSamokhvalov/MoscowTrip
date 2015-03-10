'use strict';

/* App Module */

var roadtrippersApp = angular.module('roadtrippersApp', [
   'yaMap',
  'roadtrippersControllers'
]);

roadtrippersApp.config(['$interpolateProvider',
    function($interpolateProvider,$yaMapSettings) {
        $interpolateProvider.startSymbol('{$');
        $interpolateProvider.endSymbol('$}');

//        $yaMapSettings.setCordOrder = 'latlong';
    }
]);
