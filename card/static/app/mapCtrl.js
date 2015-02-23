app.controller('mapCtrl',function($scope, placesSvc) {
    $scope.center = [55.75, 37.61];
    $scope.zoom = 11;
    $scope.markers = [];

    function getMarkers() {
        placesSvc.getPlaces().then(function(markers) {
            $scope.markers = markers;
        });
    }

    getMarkers();

});