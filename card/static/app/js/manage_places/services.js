

managePlacesApp.factory('managePlacesCvs', function($http) {
    return {
        getUserPlaces: function ($scope) {
            return $http.get('/getUserPlaces').success(function (response) {$scope.updatePlaces(response)});
        },

        getUserPlaceInfo: function ($scope, place_id) {
            return $http.get('/getUserPlaceInfo'+'?place_id='+place_id+'').success(function (response)
            {
                $scope.place.update(response);
            });
        },

        getUsedTags: function($scope) {
            return $http.get('/getTags').success(function (response) {
                $scope.updateUsedTags(response);
            });
        },

        sendPlaceInfo: function(url, place) {
            return $http.post(url, place.info).success(function (response) {
                console.log(response);
                if (response != 'ok')
                    place.showErrors(response);
            });
        },

        deleteUserPlace: function(url, place_id) {
            return $http.get(url+'?place_id='+place_id+'').success(function (response) {
                console.log(response);
            });
        }
    }
});