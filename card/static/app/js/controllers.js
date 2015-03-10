'use strict';

/* Controllers */

roadtrippersApp.controller('CardCtrl', ['$scope', 'CardSvc',
    function ($scope, CardSvc) {
        $scope.init = function(map) {

            var remoteObjectManager = new ymaps.RemoteObjectManager('places?bbox=%b',
                {
                    // Опции кластеров задаются с префиксом cluster.
                    clusterHasBalloon: false
                });

            this.map = map;
            this.map.geoObjects.add(remoteObjectManager);
            this.objects = this.map.geoObjects;

        var zoomControl = new ymaps.control.ZoomControl({options: { position: { left: 5, top: 140 }}});
        var geolocationControl = new ymaps.control.GeolocationControl({options: { position: { left: 5, top: 105 }}})
        var searchControl = new ymaps.control.SearchControl({options: { position: { right: 8, top: 10 }}});

        map.controls.add(zoomControl);
        map.controls.add(geolocationControl);
        map.controls.add(searchControl); }


        CardSvc.setFilters();
        CardSvc.setRoute();

    }
]);
