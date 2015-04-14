roadtrippersApp.factory('CardSvc', function ($http) {

    return {
        setTypes: function ($scope, types) {
            return $http.put('/types', { 'types': JSON.stringify(types) }).success(function (response) {
                $scope.rom.updateROM();
            });
        },

        getTypes: function ($scope, types) {
            return $http.get('/types').success(function (response) {

            });
        },

        getPlaceInfo: function ($scope, place_id) {
            return $http.get('/getPlaceInfo' + '?place_id=' + place_id).success(function (response) {
                var object = $scope.rom.getRom().objects.getById(place_id);
                for (var i in response) {
                    object.fields[i] = response[i];
                }
            });
        },
        setRadius: function ($scope, radius) {
            return $http.put('/radius', { 'radius': JSON.stringify(radius) }).success(function (polyline) {
                $scope.rom.updateROM();
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
                $scope.map.geoObjects.remove($scope.route.area);
                $scope.route.area = area;
                $scope.map.geoObjects.add(area);

            });
        },
        getRadius: function ($scope) {
            return $http.get('/radius').success(function (response) {

            });
        },


        setRoute: function ($scope, route) {
            var path = route.getPaths();
            var points = [];
            for(var i in path)
            {
                for(var j in path[i].properties.get("coordinates"))
                points.push(path[i].properties.get('coordinates')[j]);

            }
            $scope.route.data = route;

            return $http.post('/setRoute', { 'points': JSON.stringify(points)}).success(function (polyline) {
                    $scope.rom.updateROM();

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

                    $scope.map.geoObjects.remove($scope.route.area);
                    // Добавляем линии на карту.
                    $scope.route.area = area;
                    $scope.map.geoObjects.add(area);
                }
            );
        }
    };
});