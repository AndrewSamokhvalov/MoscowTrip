roadtrippersApp.factory('CardSvc', function ($http) {

    return {
        setTypes: function (types) {
            return $http.post('/setTypes', { 'types': JSON.stringify(types) }).success(function (response) {
//                map.update();
            });
        },

        setRoute: function (map, points) {
            return $http.post('/setRoute', { 'points': JSON.stringify(points)}).success(function (polyline) {
                        // Создаем ломаную с помощью вспомогательного класса Polyline.
                        var myPolyline = new ymaps.Polyline(polyline
                            , {
                                // Описываем свойства геообъекта.
                                // Содержимое балуна.
                                balloonContent: "Ломаная линия"
                            }, {
                                // Задаем опции геообъекта.
                                // Отключаем кнопку закрытия балуна.
                                balloonCloseButton: false,
                                // Цвет линии.
                                strokeColor: "#000000",
                                // Ширина линии.
                                strokeWidth: 4,
                                // Коэффициент прозрачности.
                                strokeOpacity: 0.5
                            });

                        // Добавляем линии на карту.
                        map.geoObjects.add(myPolyline)
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