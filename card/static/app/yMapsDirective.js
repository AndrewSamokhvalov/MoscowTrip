angular.module('ymaps')
.directive('yandexMap', ['$compile', 'ymapsLoader', function ($compile, ymapsLoader) {
    "use strict";
    return {
        restrict: 'EA',
        scope: {
            center: '=',
            zoom: '='
        },
        compile: function(tElement) {
            var childNodes = tElement.html();
            tElement.html('');
            return function($scope, element) {
                ymapsLoader.ready(function() {
                    childNodes = angular.element('<div></div>').html(childNodes).contents();
                    element.append(childNodes);
                    $compile(childNodes)($scope.$parent);
                });
            };
        },
        controller: 'YmapController'
    };
}])
.directive('ymapMarker', function () {
    "use strict";
    return {
        restrict: "EA",
        require : '^yandexMap',
        scope   : {
            coordinates: '=',
            index: '=',
            properties: '=',
            options: '='
        },
        link    : function ($scope, elm, attr, mapCtrl) {
            var marker;
            function pickMarker() {
                var coord = [
                    parseFloat($scope.coordinates[0]),
                    parseFloat($scope.coordinates[1])
                ];
                if (marker) {
                    marker.geometry.setCoordinates(coord);
                }
                else {
                    marker = mapCtrl.addMarker(coord, angular.extend({iconContent: $scope.index}, $scope.properties), $scope.options);
                }
            }

            $scope.$watch("index", function (newVal) {
                if (marker) {
                    marker.properties.set('iconContent', newVal);
                }
            });
            $scope.$watch("coordinates", function (newVal) {
                if (newVal) {
                    pickMarker();
                }
            }, true);
            $scope.$on('$destroy', function () {
                if (marker) {
                    mapCtrl.removeMarker(marker);
                }
            });
        }
    };
});
