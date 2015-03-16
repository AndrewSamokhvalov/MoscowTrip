'use strict';

/* Controllers */

roadtrippersApp.controller('CardCtrl', ['$scope', 'CardSvc',
    function ($scope, CardSvc) {
        $scope.init = function(map) {
            $scope.map = map

            ymaps.route(['москва метро пролетарская', 'Савёловский']).then(function (route) {
                CardSvc.setRoute($scope, route);
            });

            CardSvc.setTypes([1, 2]);

            var rom = CardSvc.getROM();
            map.geoObjects.add(rom);

            var zoomControl = new ymaps.control.ZoomControl({options: { position: { left: 5, top: 140 }}});
            var geolocationControl = new ymaps.control.GeolocationControl({options: { position: { left: 5, top: 105 }}})
            var searchControl = new ymaps.control.SearchControl({options: { position: { right: 8, top: 10 }}});
            var routeEditor = new ymaps.control.RouteEditor({options: { position: { left: 40, top: 105 }}});


            routeEditor.events.add('deselect', function () {
                    CardSvc.setRoute($scope, routeEditor.getRoute())
                });

            map.controls.add(zoomControl);
            map.controls.add(geolocationControl);
            map.controls.add(searchControl);
            map.controls.add(routeEditor);

        }
    }
]);
