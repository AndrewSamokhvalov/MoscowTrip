/**
 * Created by andrey on 12.04.15.
 */
roadtrippersApp
    .directive('balloon', ['$compile', function ($compile) {
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
    ]);

roadtrippersApp
    .directive('placeSlider', [ function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                places: '=places'
            },
            templateUrl: '/static/app/partials/place-slider.html',

            link: function ($scope, $element) {

                $("#show-off").click(function () {
                    $(".up-unchk").css("display", "none");
                    $(".up-chk").css("display", "inline");
                    $(".main-info").css("bottom", "-160px");
                    $(".list_of_nav_buttons").css("bottom", "0");
                });

                $("#show-on").click(function () {
                    $(".up-unchk").css("display", "inline");
                    $(".up-chk").css("display", "none");
                    $(".main-info").css("bottom", "0");
                    $(".list_of_nav_buttons").css("bottom", "160px");
                });

            },

            controller: function ($scope, $element) {
                console.log('Controller ballone content:')
                console.log($element)
            }

        }
    }
    ]);