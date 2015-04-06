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

/*
roadtrippersApp.directive('slideit', [function () {
    return {
        restrict: 'A',
         scope: true,
        replace: false,
        template: '<div class="slide" ng-repeat="place in places()"  notify-when-repeat-finished>'+
                      '<div class="rang">[[place.fields.rating]]</div>'+
                      '<img width="150px" height="150px" src=[[place.fields.image]]>'+
                '</div>',
        link: function (scope, element, attrs) {


            scope.$on('repeatFinished', function () {
                console.log("ngRepeat has finished");

                if(element.reloadSlider){
                    element.reloadSlider();
                }
                else{
                    element.bxSlider({
                    slideWidth: 145,
                    adaptiveHeight: true,
                    minSlides: 2,
                    maxSlides: 10,
                    slideMargin: 10
                    });
                }
//watch пока криво работает
                scope.$watch("places",function(newValue,oldValue) {

                });
            });
        }
    }
}])
.directive('notifyWhenRepeatFinished', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    console.log('notifyWhenRepeatFinished');
                    scope.$emit('repeatFinished');
                });
            }
        }
    }
}]);*/
