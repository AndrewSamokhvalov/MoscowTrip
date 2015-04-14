'use strict';

var managePlacesApp = angular.module('managePlacesApp', ['ngTagsInput', 'ngRoute', ]);

managePlacesApp.config(['$interpolateProvider',
    function($interpolateProvider) {
        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');
    }
]);

managePlacesApp.config(['$routeProvider', '$locationProvider',
  function($routeProvider) {
      $routeProvider
          .when('/', {
              templateUrl: '/managePlaces/addedPlaces',
              controller: 'managePlacesCtrl'
          })
          .when('/editPlace/:placeId', {
                  templateUrl: '/managePlaces/editPlace',
                  controller: 'editPlaceCtrl'
              })
          .when('/addPlace', {
                  templateUrl: '/managePlaces/addPlace',
                  controller: 'addPlaceCtrl'
              });
  }]);