'use strict';

/* Controllers */

roadtrippersApp.controller('CardCtrl', ['$scope', 'CardSvc',
    function ($scope, CardSvc) {
        $scope.init = function(map) {
            CardSvc.setFilters();
            CardSvc.setRoute();

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
