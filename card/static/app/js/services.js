roadtrippersApp.factory('CardSvc', function($http) {
    var filters = [1, 2, 3];
    var route = [[55.76,37.64],[55.76,37.68],[55.76,37.80]]
    return {
        setFilters: function() {
            var req = {
                method: 'POST',
                url: '/setFilters',
                params: { 'filters': JSON.stringify(filters) }
            };
            return $http(req).then(function (response) {
                return response;
            });
        },

        setRoute: function() {
            var req = {
                method: 'POST',
                url: '/setRoute',
                params: { 'route': JSON.stringify(route)}
            };
            return $http(req).then(function (response) {
                return response;
            });
        },

        getROM: function() {
            return new ymaps.RemoteObjectManager('getPlaces?bbox=%b',
                {
                    // Опции кластеров задаются с префиксом cluster.
                    clusterHasBalloon: false
                });
        }
    };
});