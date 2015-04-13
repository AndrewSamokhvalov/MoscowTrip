roadtrippersApp.factory('CardSvc', function ($http) {

    return {
        setTypes: function ($scope, types) {
            return $http.post('/setTypes', { 'types': JSON.stringify(types) }).success(function (response) {
                $scope.rom.updateROM();
            });
        },

        getPlaceInfo: function ($scope, place_id) {
            return $http.get('/getPlaceInfo' + '?place_id=' + place_id + '').success(function (response) {
                var data = response[0];
                var object = $scope.rom.getRom().objects.getById(place_id);
                for (var i in data.fields) {
                    object.fields[i] = data.fields[i];
                }
            });
        },
        setRadius: function ($scope, radius) {
            return $http.post('/setRadius', { 'radius': JSON.stringify(radius) }).success(function (response) {
                $scope.rom.updateROM();
            });
        },
        setRoute: function ($scope, route) {
            var points = [];
            route.getPaths().each(function (path) {
                points.push(path.geometry.getCoordinates())
            });

            $scope.map.geoObjects.remove($scope.route.data);
            $scope.map.geoObjects.remove($scope.route.area);

            $scope.route.data = route;
            $scope.map.geoObjects.add(route);

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
                        fillColor: '#65BDE8',
                        // Цвет обводки.
                        strokeColor: '#65BDE8',
                        // Общая прозрачность (как для заливки, так и для обводки).
                        opacity: 0.5,
                        // Ширина обводки.
                        strokeWidth: 0,
                        // Стиль обводки.
                        strokeStyle: 'shortdash'
                    });

                    // Добавляем линии на карту.
                    $scope.route.area = area;
                    $scope.map.geoObjects.add(area);
                    $scope.rom.updateROM();
                }
            );
        }
    };
});