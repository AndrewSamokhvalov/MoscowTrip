'use strict';

/* App Module */

var roadtrippersApp = angular.module('roadtrippersApp', [
//  'ngRoute',
//  'phonecatAnimations',
//
  'roadtrippersControllers',
//  'phonecatFilters',
//  'phonecatServices',
   'yaMap'
]);

roadtrippersApp.config(['$interpolateProvider',
    function($interpolateProvider) {
        $interpolateProvider.startSymbol('{$');
        $interpolateProvider.endSymbol('$}');
    }
]);
