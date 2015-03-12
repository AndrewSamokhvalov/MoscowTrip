'use strict';

/* Controllers */

roadtrippersApp.controller('CardCtrl', ['$scope', 'CardSvc',
    function ($scope, CardSvc) {
        $scope.init = function(map) {

            ymaps.route(['Королёв','Химки']).then(function (route) {
                var points = []
                route.getPaths().each(function(path){points.push(path.geometry.getCoordinates())})
                CardSvc.setRoute(map, points[0]);
            });


            CardSvc.setTypes([1,2]);


            var rom = CardSvc.getROM();
            map.geoObjects.add(rom);

            var zoomControl = new ymaps.control.ZoomControl({options: { position: { left: 5, top: 140 }}});
            var geolocationControl = new ymaps.control.GeolocationControl({options: { position: { left: 5, top: 105 }}})
            var searchControl = new ymaps.control.SearchControl({options: { position: { right: 8, top: 10 }}});

            map.controls.add(zoomControl);
            map.controls.add(geolocationControl);
            map.controls.add(searchControl); }

    }
]);
