/**
 * Created by andrey on 12.04.15.
 */
roadtrippersApp
    .directive('rtBalloon', ['$compile', function ($compile) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            templateUrl: '/static/app/partials/balloon.html',

            link: function ($scope, $element) {
//                console.log('Link ballone content:')
//                console.log($element)

            }
        }
    }
    ])

    .directive('rtPlaceSlider', [ function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                places: '=places',
                currentPlace: '=currentPlace'

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

            }
        }
    }
    ])

    .directive('rtImg', [ function () {
        return {
            restrict: 'E',
            replace: true,
            template: '<img ng-src="{{ place.fields.image }}">',
            scope: {
                place: '=place',
                currentPlace: '=currentPlace'
            },

            link: function ($scope, element) {
                element.bind('click', function () {
                    console.log($scope.place.fields.id)
                    $scope.currentPlace.init(parseInt($scope.place.fields.id))
                    $scope.currentPlace.load(parseInt($scope.place.fields.id))
                    console.log($scope.currentPlace);
                    $('#detailPlaceInfo').modal('show');
                });

            }
        }
    }
    ]);

