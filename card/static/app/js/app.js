'use strict';

/* App Module */

var roadtrippersApp = angular.module('roadtrippersApp', ['yaMap', 'uiSlider', 'slick',
    'ngTagsInput', 'ngRoute', ]);

roadtrippersApp.config(['$interpolateProvider','yaMapSettingsProvider',
    function($interpolateProvider,yaMapSettings) {
        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');
        yaMapSettings.setOrder('latlong');
    }
])
.config(['$routeProvider', '$locationProvider',
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