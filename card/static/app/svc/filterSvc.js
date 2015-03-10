app.factory('filterSvc', function($http) {
    var filters = [1, 2, 3];
    return {
        updateFilters: function() {
            var req = {
                method: 'POST',
                url: '/setFilters',
                params: { 'filters': filters }
            };
            return $http(req).then(function (response) {
                return response;
            });
        }
    };
});