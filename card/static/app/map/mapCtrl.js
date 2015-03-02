app.controller('mapCtrl', ['$scope', '$element', 'mapLoader', 'mapConfig', 'debounce', 'placesSvc', function ($scope, $element, mapLoader, config, debounce, placesSvc) {
    "use strict";
    $scope.center = [55.75, 37.61];
    $scope.zoom = 11;
    function initAutoFit(map, collection) {
        //brought from underscore http://underscorejs.org/#debounce
        var markerMargin = 0.1,
            fitMarkers = debounce(function () {
                if(collection.getLength() > 0) {
                    var bounds = collection.getBounds(),
                    //make some margins from
                        topRight = [
                            bounds[1][0] + markerMargin,
                            bounds[1][1] + markerMargin
                        ],
                        bottomLeft = [
                            bounds[0][0] - markerMargin,
                            bounds[0][1] - markerMargin
                        ];
                    map.setBounds([bottomLeft, topRight], {checkZoomRange: true});
                }
            }, 100);
        collection.events.add('boundschange', fitMarkers);
    }
    var self = this;
    mapLoader.ready(function(ymaps) {
        self.addMarker = function(coordinates, properties, options) {
            var placeMark = new ymaps.Placemark(coordinates, properties, options);
            $scope.markers.add(placeMark);
            return placeMark;
        };
        self.removeMarker = function (marker) {
            $scope.markers.remove(marker);
        };
        self.map = new ymaps.Map($element[0], {
            center   : $scope.center || [0, 0],
            zoom     : $scope.zoom || 0,
            behaviors: config.mapBehaviors
        });
        $scope.markers = new ymaps.GeoObjectCollection({}, config.markerOptions);

        placesSvc.getPlaces().then(function(markers) {
            markers.forEach(function(marker) {
                self.addMarker(marker.coords, marker.properties, marker.id);
            });
        });

        self.map.geoObjects.add($scope.markers);
        if(config.fitMarkers) {
            initAutoFit(self.map, $scope.markers);
        }
        var updatingBounds;
        $scope.$watch('center', function(newVal) {
            if(!updatingBounds) {
                self.map.panTo(newVal);
            }
        }, true);
        $scope.$watch('zoom', function(zoom) {
            if(!updatingBounds) {
                self.map.setZoom(zoom, {checkZoomRange: true});
            }
        });
        self.map.events.add('boundschange', function(event) {
            //noinspection JSUnusedAssignment
            updatingBounds = true;
            $scope.$apply(function() {
                $scope.center = event.get('newCenter');
                $scope.zoom = event.get('newZoom');
            });
            updatingBounds = false;
        });

    });
}]);