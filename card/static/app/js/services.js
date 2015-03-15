roadtrippersApp.factory('CardSvc', function ($http) {

    return {
        setTypes: function (types) {
            return $http.post('/setTypes', { 'types': JSON.stringify(types) }).success(function (response) {
//                map.update();
            });
        },

        setPlaceInfo: function (place_id, scope) {
            return $http.get('/getPlaceInfo', { 'types': JSON.stringify(place_id) }).success(function (response) {
//                   scope
            });
        },

        setRoute: function (map, route) {
            var points = []
            route.getPaths().each(function(path){points.push(path.geometry.getCoordinates())})
            map.geoObjects.add(route)
            return $http.post('/setRoute', { 'points': JSON.stringify(points[0])}).success(function (polyline) {


                        // Создаем ломаную с помощью вспомогательного класса Polyline.
                        var myGeoObject = new ymaps.GeoObject({
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
                        map.geoObjects.add(myGeoObject)
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