roadtrippersApp.factory('CardSvc', function ($http) {

    return {
        setTypes: function ($scope, types) {
            return $http.post('/setTypes', { 'types': JSON.stringify(types) }).success(function (response) {
                $scope.updateROM()
            });
        },

        setPlaceInfo: function (place_id, scope) {
            return $http.get('/getPlaceInfo', { 'types': JSON.stringify(place_id) }).success(function (response) {
            });
        },

        setRoute: function ($scope, route) {
            var points = []
            route.getPaths().each(function(path){points.push(path.geometry.getCoordinates())})

            $scope.map.geoObjects.remove($scope.route)
            $scope.map.geoObjects.remove($scope.area)

            $scope.route = route
            $scope.map.geoObjects.add(route)

            return $http.post('/setRoute', { 'points': JSON.stringify(points[0])}).success(function (polyline) {

                        // Создаем ломаную с помощью вспомогательного класса Polyline.
                        var area = new ymaps.GeoObject({
                        // Описываем геометрию геообъекта.
                            geometry: {
                                // Тип геометрии - "Многоугольник".
                                type: "Polygon",
                                // Указываем координаты вершин многоугольника.
                                coordinates: polyline,
                                // Задаем правило заливки внутренних контуров по алгоритму "nonZero".
                                fillRule: "nonZero"
                            }
                        }, {
                            // Описываем опции геообъекта.
                            // Цвет заливки.
                            fillColor: '#00FFFF',
                            // Цвет обводки.
                            strokeColor: '#0000FF',
                            // Общая прозрачность (как для заливки, так и для обводки).
                            opacity: 0.5,
                            // Ширина обводки.
                            strokeWidth: 0,
                            // Стиль обводки.
                            strokeStyle: 'shortdash'
                        });

                        // Добавляем линии на карту.
                        $scope.area = area
                        $scope.map.geoObjects.add(area)
                        $scope.updateROM()
                });
        }
    };
});