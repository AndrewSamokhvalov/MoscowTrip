app.directive('map', ['$compile', 'mapLoader', function ($compile, mapLoader) {
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
                mapLoader.ready(function() {
                    childNodes = angular.element('<div></div>').html(childNodes).contents();
                    element.append(childNodes);
                    $compile(childNodes)($scope.$parent);
                });
            };
        },
        controller: 'mapCtrl'
    };
}]);