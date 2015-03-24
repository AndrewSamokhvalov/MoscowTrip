'use strict';

/* Controllers */

roadtrippersApp.controller('CardCtrl', ['$scope', 'CardSvc',
    function ($scope, CardSvc) {

        var m = {
                    "4.4": "static/app/images/0001.jpg",
                    "3.2": "static/app/images/0001.jpg",
                    "1.4": "static/app/images/0001.jpg",
                    "2.2": "static/app/images/0001.jpg",
                    "4.5": "static/app/images/0001.jpg",
                    "5.4": "static/app/images/0001.jpg",
                    "5.2": "static/app/images/0001.jpg",
                    "6.4": "static/app/images/0001.jpg",
                    "6.2": "static/app/images/0001.jpg",
                    "6.5": "static/app/images/0001.jpg",
                    "5.0": "static/app/images/0001.jpg"
                };
        $scope.GeoObjects = m;
        $scope.example = "Sergey";

        $scope.createROM = function(){
            this.rom = new ymaps.RemoteObjectManager('getPlaces?bbox=%b',
                {
                    clusterHasBalloon: false
                });
            $scope.map.geoObjects.add(this.rom);
        }

        $scope.deleteROM = function(){
            if(this.rom != null) {
                $scope.map.geoObjects.remove(this.rom);
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
    }
]);
