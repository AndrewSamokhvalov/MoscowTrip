'use strict';


roadtrippersApp.controller('CardCtrl', ['$scope', '$timeout', '$compile', 'CardSvc',
    function ($scope, $timeout, $compile, CardSvc) {
        $scope.filters = [];

        $scope.init = function (map) {

            // Создадим пользовательский макет редактора маршрута
            var MyRouteEditorLayout = ymaps.templateLayoutFactory.createClass("<div>" +
                "<div id='routeEditorButton' class='btn btn-default btn-routeControll {% if state.selected %}my-button-selected{% endif %}'>" +
                "<img src='/static/app/images/routeIcon.svg' />" +
                "</div>", {

                // Переопределяем методы макета, чтобы выполнять дополнительные действия
                // при построении и очистке макета.
                build: function () {
                    // Вызываем родительский метод build.
                    MyRouteEditorLayout.superclass.build.call(this);

                    this.STATES = {
                        START: {value: 0, name: "Start", code: "S"},
                        FINISH: {value: 1, name: "Finish", code: "F"}
                    };


                    this.state = this.STATES.START.value;
                    this.startPoint = [];
                    this.finishPoint = [];

                    // Привязываем функции-обработчики к контексту и сохраняем ссылки
                    // на них, чтобы потом отписаться от событий.
                    this.initEventsCallback = ymaps.util.bind(this.initEvents, this);

                    // Начинаем слушать клики на кнопках макета.
                    $('#routeEditorButton').bind('click', this.initEventsCallback);
                },

//                При клике контрол:
//                1. становится Активным (изменяется вид)
//                2. Повести эвенты на клик карты

//                При клике на карту:
//                1. Сохраняем координаты стартовой точки
//                2. Сохраняем координаты конечной точки
//                3. Если вторая точка сохранена, то строим маршрут
//                4. Делаем кнопку неактивной

                clear: function () {
                    // Снимаем обработчики кликов.
                    $('#routeEditorButton').unbind('click', this.initEventsCallback);

                    // Вызываем родительский метод clear.
                    MyRouteEditorLayout.superclass.clear.call(this);
                },

                initEvents: function () {
                    this.addPointCallback = this.addPoints(this);
                    map.events.add('click', this.addPointCallback);
                },

                addPoints: function (p) {
                    return function (e) {
                        switch (p.state) {
                            case p.STATES.START.value:
                                $scope.route.start = e.get('coords');
                                console.log('Start:' + p.startPoint);
                                p.state++;
                                break;

                            case p.STATES.FINISH.value:
                                $scope.route.finish = e.get('coords');
                                console.log('Finish:' + p.finishPoint);

                                p.buildRoute();

                                // Очищение
                                map.events.remove('click', p.addPointCallback);
                                p.state = p.STATES.START.value;
                                break;
                        }
                    }
                },

                buildRoute: function () {

                }
            });

            var MyRouteEditor = new ymaps.control.Button({
                data: {
                    content: ""
                },
                options: {
                    layout: MyRouteEditorLayout,
                    position: { left: 42, top: 95 }
                }
            });

            $scope.filters = new MapObjectFilter($scope, CardSvc);
            $scope.slidefilter = new SlideFilter();
            $scope.rom = new ROM($scope, $compile, CardSvc);
            $scope.currentPlace = new Place($scope, CardSvc);

            $scope.radius = 1000;
            CardSvc.setRadius($scope, 1000);
            $scope.$watch('radius', function (newVal, oldVal) {
                CardSvc.setRadius($scope, newVal);
            });

            $scope.map = map;

            var zoomControl = new ymaps.control.ZoomControl({options: { position: { left: 5, top: 140 }}});
            var geolocationControl = new ymaps.control.GeolocationControl({options: { position: { left: 5, top: 105 }}});
            var searchControl = new ymaps.control.SearchControl({options: { position: { right: 1, top: 10 }}});
            var searchStartPoint = new ymaps.control.SearchControl({
                options: {
                    useMapBounds: true,
                    noPlacemark: true,
                    noPopup: true,
                    placeholderContent: 'Адрес начальной точки',
                    size: 'large',
                    position: { right:1, top: 44 }
                }
            });
            var searchFinishPoint = new ymaps.control.SearchControl({
                options: {
                    useMapBounds: true,
                    noCentering: true,
                    noPopup: true,
                    noPlacemark: true,
                    placeholderContent: 'Адрес конечной точки',
                    size: 'large',
                    float: 'none',
                    position: { right:1, top: 76 }
                }
            });

            $scope.route = new Route($scope, CardSvc);

            map.controls.add(zoomControl);
            map.controls.add(geolocationControl);
            map.controls.add(searchControl);
            map.controls.add(MyRouteEditor);
            map.controls.add(searchStartPoint);
            map.controls.add(searchFinishPoint);

            map.events.add('balloonopen', function (e) {
                var balloon = e.get('balloon');
                map.events.add('click', function (e) {
                    if (e.get('target') === map) { // Если клик был на карте, а не на геообъекте
                        map.balloon.close();
                    }
                });
            });

            searchStartPoint.events.add('resultselect', function (e) {
                var results = searchStartPoint.getResultsArray(),
                selected = e.get('index'),
                point = results[selected].geometry.getCoordinates();

                    calculator.setStartPoint(point);
            })
                .add('load', function (event) {
                    // По полю skip определяем, что это не дозагрузка данных.
                    // По getRusultsCount определяем, что есть хотя бы 1 результат.
                    if (!event.get('skip') && searchStartPoint.getResultsCount()) {
                        searchStartPoint.showResult(0);
                    }
                });

            searchFinishPoint.events.add('resultselect', function (e) {
                var results = searchFinishPoint.getResultsArray(),
                    selected = e.get('index'),
                    point = results[selected].geometry.getCoordinates();

                    calculator.setFinishPoint(point);
            })
                .add('load', function (event) {
                    // По полю skip определяем, что это не дозагрузка данных.
                    // По getRusultsCount определяем, что есть хотя бы 1 результат.
                    if (!event.get('skip') && searchFinishPoint.getResultsCount()) {
                        searchFinishPoint.showResult(0);
                    }
                });

        };
    }
])
    .controller('AdminCtrl', ['$scope', 'CardSvc',
        function ($scope, CardSvc) {


            $scope.name = "Kostya";

        }]);

function MapObjectFilter($scope, CardSvc) {
    var filterArray = [];

    function getFilterFromServer() {
        $.get('/getFilters')
            .success(function (data) {
                filterArray = data;
            });

    }

    function isChecked(indx) {
        var i = filterArray.indexOf(indx);
        if(i >= 0)
            return true;
        return false;
    }

    function switchFilter(filter) {
        var indx = filter;
        if (indx) {
            var i = filterArray.indexOf(indx);
            if (i >= 0)
                filterArray.splice(i, 1);
            else
                filterArray.push(indx);
            CardSvc.setTypes($scope, filterArray);
        }
    }

    return{
        filters: filterArray,
        switchFilter: function (i) {
            switchFilter(i)
        },
        isChecked: function (i) {
            isChecked(i)
        }
    }
}

function ROM($scope, $compile, CardSvc) {
    var rom;
    this.places = null;

    this.createROM = function () {
        var MyBalloonLayout = ymaps.templateLayoutFactory.createClass
        (
                '<div class="modal-dialog">' +
                '<div class="modal-content popover">' +
                '<rt-balloon></rt-balloon>' +
                '</div>' +
                '</div>'

            ,
            {

                build: function () {

//                    Идите нахуй я не буду это исправлять
                    this.constructor.superclass.build.call(this);
                    var chart = angular.element(document.createElement('rt-balloon'));
                    var el = $compile(chart)($scope);
                    $('rt-balloon').replaceWith(el)

                    this._$element = $('.popover', this.getParentElement());
                    this.applyElementOffset();

                },

                /**
                 * Удаляет содержимое макета из DOM.
                 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/layout.templateBased.Base.xml#clear
                 * @function
                 * @name clear
                 */
                clear: function () {
                    this.constructor.superclass.clear.call(this);
                },

                /**
                 * Метод будет вызван системой шаблонов АПИ при изменении размеров вложенного макета.
                 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
                 * @function
                 * @name onSublayoutSizeChange
                 */
                onSublayoutSizeChange: function () {
                    MyBalloonLayout.superclass.onSublayoutSizeChange.apply(this, arguments);

                    if (!this._isElement(this._$element)) {
                        return;
                    }

                    this.applyElementOffset();

                    this.events.fire('shapechange');
                },

                /**
                 * Сдвигаем балун, чтобы "хвостик" указывал на точку привязки.
                 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
                 * @function
                 * @name applyElementOffset
                 */
                applyElementOffset: function () {
                    this._$element.css({
                        left: -(this._$element[0].offsetWidth / 2 + 75),
                        top: -(this._$element[0].offsetHeight / 2 + 230)
                    });
                },


                /**
                 * Используется для автопозиционирования (balloonAutoPan).
                 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/ILayout.xml#getClientBounds
                 * @function
                 * @name getClientBounds
                 * @returns {Number[][]} Координаты левого верхнего и правого нижнего углов шаблона относительно точки привязки.
                 */
                getShape: function () {
                    if (!this._isElement(this._$element)) {
                        return MyBalloonLayout.superclass.getShape.call(this);
                    }

                    var position = this._$element.position();

                    return new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([
                        [position.left, position.top],
                        [
                                position.left + this._$element[0].offsetWidth,
                                position.top + this._$element[0].offsetHeight + this._$element.find('.arrow')[0].offsetHeight
                        ]
                    ]));
                },

                /**
                 * Проверяем наличие элемента (в ИЕ и Опере его еще может не быть).
                 * @function
                 * @private
                 * @name _isElement
                 * @param {jQuery} [element] Элемент.
                 * @returns {Boolean} Флаг наличия.
                 */
                _isElement: function (element) {
                    return element && element[0] && element.find('.arrow')[0];
                }
            }
        );

        rom = new ymaps.RemoteObjectManager('getPlaces?bbox=%b',
            {
                clusterHasBalloon: false,
                geoObjectBalloonShadow: false,
                geoObjectBalloonLayout: MyBalloonLayout,
                geoObjectBalloonPanelMaxMapArea: 0,
                geoObjectHideIconOnBalloonOpen: false,
                geoObjectBalloonOffset: [3, 0]
            });

//        rom.setFilter('id > 0');
        rom.objects.events.add('add', function (event) {
            var isSegmentLoaded = event.get('objectId') < 0;
            if (isSegmentLoaded) {
                $scope.$apply(function () {
                    console.log('Add current count - ' + rom.objects.getAll().length)
                    $scope.rom.places = rom.objects.getAll();
                })
            }
        });
        rom.objects.events.add('remove', function (event) {
            var isSegmentRemoved = event.get('objectId') < 0;
            if (isSegmentRemoved) {
                $scope.$apply(function () {
                    console.log('Remove: current count - ' + rom.objects.getAll().length)

                    $scope.rom.places = rom.objects.getAll();
                })
            }
        });

        rom.events.add('click', function (event) {
            var id = event.get('objectId');
            $scope.currentPlace.init(id);
        });

        $scope.map.geoObjects.add(rom);

    };

    this.deleteROM = function deleteROM() {
        if (rom != null) {
            $scope.map.geoObjects.remove(rom);
//                $scope.$apply()
        }

    };

    this.updateROM = function () {
        this.deleteROM();
        this.createROM();
    };

    this.getRom = function () {
        if (!rom) this.createROM();
        return rom
    };
}

function Place($scope, CardSvc) {
    this.fields = {};
    this.init = function (id) {
        var object = $scope.rom.getRom().objects.getById(id);
        $scope.currentPlace.fields = object.fields;
    };

    this.addToTrip = function()
    {
        this.load(parseInt(this.fields.id));
        $scope.route.addPoint(this);
    };
    this.load = function (id) {
            CardSvc.getPlaceInfo($scope, id)
    }
}
function Route($scope, CardSvc)
{
    var _start;
    var _finish;
    this.area = null;
    this.multiRoute;

    this.addPoint = function (place)
    {
        var coords = $scope.rom.getRom().objects.getById(place.fields.id).geometry.coordinates;
        var referencePoints = this.multiRoute.model.getReferencePoints();
        referencePoints.splice(1, 0, coords);
        this.multiRoute.model.setReferencePoints(referencePoints, [1]);
        CardSvc.setRoute($scope,this.multiRoute.model.getRoutes()[0]);
    };

    this.addRoute = function (start, finish)
    {

        if(!(finish&&start)) return;
        if(this.multiRoute) $scope.map.geoObjects.remove(this.multiRoute);
        var multiRoute = new ymaps.multiRouter.MultiRoute({
            referencePoints: [
                start,
                finish
            ],
            params: {
                // avoidTrafficJams: true,
                //routingMode: 'masstransit'
            }
        });

        multiRoute.events.once("activeroutechange", function (event)
        {
        });

        multiRoute.model.events.once("requestsuccess", function (event)
        {
            var multiRouteModel = event.get("target");
            var firstroute = multiRouteModel.getRoutes()[0];

            CardSvc.setRoute($scope, firstroute);
        });

        this.multiRoute = multiRoute;
        $scope.map.geoObjects.add(multiRoute);
    };

    this.__defineSetter__("start",function(value)
    {
        _start = value;
        this.addRoute(_start,_finish);
    });

    this.__defineSetter__("finish",function(value)
    {
        _finish = value;
        this.addRoute(_start,_finish);
    });

    this.__defineGetter__("start",function()
    {
        return _start;
    });

    this.__defineGetter__("finish",function()
    {
        return _finish;
    });

//    routeEditor.events.add('deselect', function (route) {
//        var route = routeEditor.getRoute();
//        route.then(function () {
//            var points = route.getWayPoints();
//            var lastPoint = points.getLength() - 1;
//
//            // Задаем контент меток в начальной и конечной точках.
////        "iconLayout": "default#image",
////                "iconImageHref": place.id_type.url_image_marker,
////                "iconImageSize": [30, 40],
//            points.get(0).properties.set('iconLayout', 'default#image');
//            points.get(0).properties.set('iconImageHref', '/static/app/images/metka1.png');
//            points.get(0).properties.set('iconImageSize', '[40, 40]');
//
//            points.get(0).properties.set('iconContent', ' ');
//
//
//            points.get(lastPoint).properties.set('iconImageHref', '/static/app/images/metka1.png');
//        })
//        CardSvc.setRoute($scope, routeEditor.getRoute());
//    });

}

function SlideFilter($scope, routeEditor, CardSvc) {
    this.idfilter = function (place) {
        return parseInt(place.fields.id) > 0
    }
}