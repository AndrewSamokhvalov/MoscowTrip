app.factory('placesSvc', function($http) {
    var filters = [1];
    return {
        getPlaces: function() {
            var req = {
                method: 'GET',
                url: '/places',
                params: { 'filters': [1] }
            };
            return $http(req).then(function (response) {
                return response.data;
            });
        }
    };
});