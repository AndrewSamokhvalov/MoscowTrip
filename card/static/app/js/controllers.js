'use strict';

/* Controllers */

roadtrippersApp.controller('CardCtrl', ['$scope', 'CardSvc',
    function ($scope, CardSvc) {

        $scope.places = function(){ return $scope.rom.objects.getAll() }

        $scope.createROM = function(){
            this.rom = new ymaps.RemoteObjectManager('getPlaces?bbox=%b',
                {
                    clusterHasBalloon: false
                });

            this.rom.objects.events.add('add', function(child) {
                $scope.$apply();
            });

            this.rom.objects.events.add('remove', function(child) {
                $scope.$apply();
            });

            $scope.map.geoObjects.add(this.rom);

        }

        $scope.deleteROM = function(){
            if(this.rom != null) {
                $scope.map.geoObjects.remove(this.rom);
                $scope.$apply()
            }

        }

        $scope.updateROM = function(){
            $scope.deleteROM();
            $scope.createROM();
        }

        $scope.setTypes = function(types){
            CardSvc.setTypes($scope, [1,2]);
        }



        $scope.init = function(map) {
            $scope.map = map

            ymaps.route(['москва метро пролетарская', 'Савёловский']).then(function (route) {
                CardSvc.setRoute($scope, route);
            });



            $scope.setTypes('ла-ла-ла')

            $scope.createROM()

            var zoomControl = new ymaps.control.ZoomControl({options: { position: { left: 5, top: 140 }}});
            var geolocationControl = new ymaps.control.GeolocationControl({options: { position: { left: 5, top: 105 }}})
            var searchControl = new ymaps.control.SearchControl({options: { position: { right: 1, top: 10 }}});
            var routeEditor = new ymaps.control.RouteEditor({options: { position: { left: 40, top: 105 }}});


            routeEditor.events.add('deselect', function () {
                    CardSvc.setRoute($scope, routeEditor.getRoute())
                });

            map.controls.add(zoomControl);
            map.controls.add(geolocationControl);
            map.controls.add(searchControl);
            map.controls.add(routeEditor);

        }

        $scope.placeUpdate = function(){
            $scope.places = []
            $scope.rom.objects.each(function(place){ $scope.places.push(place.fields)})
        }

    }
]);
