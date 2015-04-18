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

    .directive('rtDownCollapsible', [ '$filter', function ($filter) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                places: '=places',
                currentPlace: '=',
                sliderFilter: '=',
                sliderApply:'='

            },
            templateUrl: '/static/app/partials/rt-down-collapsible.html',

            link: function ($scope, $element) {

                $("#show-off").click(function () {
                    $(".up-unchk").css("display", "none");
                    $(".up-chk").css("display", "inline");
                    $(".main-info").css("bottom", "-160px");
                    $(".list_of_nav_buttons").css("bottom", "0");
                    $(".main-info-right").css("bottom", "5px");
                });

                $("#show-on").click(function () {
                    $(".up-unchk").css("display", "inline");
                    $(".up-chk").css("display", "none");
                    $(".main-info").css("bottom", "0");
                    $(".list_of_nav_buttons").css("bottom", "160px");
                    $(".main-info-right").css("bottom", "165px");
                });

            }
        }
    }
    ])

    .directive('rtRightCollapsible', [ '$filter', function ($filter) {
        return {
            restrict: 'E',
            replace: true,

            templateUrl: '/static/app/partials/rt-right-collapsible.html',

            link: function ($scope, $element) {
                $("#show-off-right").click(function () {
                    $(".up-unchk-right").css("display", "none");
                    $(".up-chk-right").css("display", "inline");
                    $(".main-info-right").css("right", "-315px");
                    $(".list_of_nav_buttons_right").css("right", "0");
                    $scope.searchControl.options.set('position', {right: 2, top: 10});
                });


                $("#show-on-right").click(function () {
                    $(".up-unchk-right").css("display", "inline");
                    $(".up-chk-right").css("display", "none");
                    $(".main-info-right").css("right", "0");
                    $(".list_of_nav_buttons_right").css("right", "315px");
                    $scope.searchControl.options.set('position', {right: 340, top: 10});
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
                    if ($scope.currentPlace != $scope.place) {

                        $scope.currentPlace.init(parseInt($scope.place.fields.id));
                        $scope.currentPlace.load(parseInt($scope.place.fields.id));

                        $scope.currentPlace.open();

                        return;
                    }

                    //$scope.currentPlace.init(parseInt($scope.place.fields.id));
                    //$scope.currentPlace.load(parseInt($scope.place.fields.id));
                    $('#detailPlaceInfo').modal('show');
                });

            }
        }
    }
    ]);

