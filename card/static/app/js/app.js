'use strict';

/* App Module */

var roadtrippersApp = angular.module('roadtrippersApp', ['yaMap']);


roadtrippersApp.config(['$interpolateProvider','yaMapSettingsProvider',
    function($interpolateProvider,yaMapSettings) {
        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');
        yaMapSettings.setOrder('latlong');
    }
]);


roadtrippersApp.directive('slideit', ['$interval' , function ($interval) {
    return {
        restrict: 'A',
        scope: true,
        replace: false,
        template: '<div class="slide" ng-repeat="place in places() | limitTo: 20"  notify-when-repeat-finished>' +
        '<div class="rang">[[place.fields.rating]]</div>' +
        '<img width="150px" height="150px" src=[[place.fields.image]]>' +
        '</div>',
        link: function (scope, element, attrs) {
            element.bxSlider({
                                 slideWidth: 145,
                                 adaptiveHeight: true,
                                 minSlides: 2,
                                 maxSlides: 10,
                                 slideMargin: 10
                             });

            scope.$watch('UpdateObject', function(newValue, oldValue) {
                $interval(function() {
                    if (newValue != oldValue ){
                        element.reloadSlider();
                    }
                }, 3000);
            });
        }
    }
}])

