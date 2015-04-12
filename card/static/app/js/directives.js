/**
 * Created by andrey on 12.04.15.
 */
roadtrippersApp.directive('balloon', ['$compile', function ($compile) {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        templateUrl: '/static/app/partials/balloon.html',

        link: function ($scope, $element) {
            console.log('Link ballone content:')
            console.log($element)

        },

        controller: function ($scope, $element) {
            console.log('Controller ballone content:')
            console.log($element)
        }

    }
}
])
;