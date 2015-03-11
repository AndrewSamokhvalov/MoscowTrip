roadtrippersApp.factory('CardSvc', function ($http) {

    return {
        setTypes: function (types) {
            return $http.post('/setTypes', { 'types': JSON.stringify(types) }).success(function (response) {
//                map.update();
            });
        },

        setRoute: function (points) {
            return $http.post('/setRoute', { 'points': JSON.stringify(points)}).success(function (response) {
                    //                        map.update();
                });
        },

        getROM: function () {
            return new ymaps.RemoteObjectManager('getPlaces?bbox=%b',
                {
                    // Опции кластеров задаются с префиксом cluster.
                    clusterHasBalloon: false
                });
        }
    };
});