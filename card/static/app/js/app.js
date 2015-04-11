'use strict';

/* App Module */

var roadtrippersApp = angular.module('roadtrippersApp', ['yaMap', 'uiSlider', 'slick']);


roadtrippersApp.config(['$interpolateProvider', 'yaMapSettingsProvider',
    function ($interpolateProvider, yaMapSettings) {
        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');
        yaMapSettings.setOrder('latlong');
    }
])

    .directive('balloon', ['$compile', function ($compile) {
        return {
            restrict: 'E',
            replace: true,
            template:
                    '<div class="modal-dialog">' +
                        '<div class="modal-content popover top">' +
                            '<div class="modal-body" style="padding: 3px;">' +
                                '<div class="media arrow">' +
                                    '<img class="media-object" ng-click="currentPlace.show()" ng-src="[[currentPlace.fields.image]]" alt="img" height="150px" width="150px">' +
                                    '<div class="rating">' +
                                        '<div class="value-rating">' +
                                            '[[currentPlace.fields.rating]]' +
                                        '</div>' +
                                    '</div>' +
                                    '<span class="place-name"> [[ currentPlace.fields.name ]]</span>' +
                                    '<div class="like-balloon">' +
                                        '<span class="icon icon-heart"></span>' +
                                    '</div>' +
                                    '<div class="trip-balloon">' +
                                        '<span class="icon icon-cab"></span>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>',

            link: function ($scope, $element) {
                console.log('Link ballone content:')
                console.log($element)
            },

            controller: function ($scope, $element) {
                console.log('Controller ballone content:')
                console.log($element)
            }

        }
    }]);
