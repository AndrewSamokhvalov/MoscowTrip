'use strict';

/* Controllers */

var roadtrippersControllers = angular.module('roadtrippersControllers', []);


roadtrippersControllers.controller('CardCtrl', ['$scope',
    function ($scope) {
        var _map;
        $scope.afterMapInit = function(map){

            var remoteObjectManager = new ymaps.RemoteObjectManager('testPlaces?bbox=%b',
            {
                // Опции кластеров задаются с префиксом cluster.
                clusterHasBalloon: false,
            });

            this.map = map;
            this.map.geoObjects.add(remoteObjectManager);
            this.objects = this.map.geoObjects;
        };
    }
]);
