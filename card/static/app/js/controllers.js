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
                        STATES: {
                            INIT: {value: 0, name: "Init", code: "I"},
                            INACTIVE: {value: 1, name: "Inactive", code: "N"},
                            WAIT_START: {value: 2, name: "Wait_Start", code: "S"},
                            WAIT_FINISH: {value: 3, name: "Wait_Finish", code: "F"}
                        },

                        STATE: {value: 1, name: "Inactive", code: "I"},

                        build: function () {
                            // Вызываем родительский метод build.
                            MyRouteEditorLayout.superclass.build.call(this);

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
                            $('#routeEditorButton').unbind('click', this.initEventsCallback);
                            MyRouteEditorLayout.superclass.clear.call(this);
                        },

                        initEvents: function (e) {
                            if (this.STATE.value == this.STATES.INACTIVE.value) {
                                this.addPointCallback = ymaps.util.bind(this.addPoints, this);

                                map.events.add('click', this.addPointCallback);
                                $('#routeEditorButton').addClass('btn-routeControll-action');
                                this.STATE = this.STATES.WAIT_START;
                            }
                            else {
                                $scope.route.clear();
                                map.events.remove('click', this.addPointCallback);
                                $('#routeEditorButton').removeClass('btn-routeControll-action');
                                this.STATE = this.STATES.INACTIVE;
                            }
                        },

                        addPoints: function (e) {

                            switch (this.STATE.value) {
                                case this.STATES.WAIT_START.value:
                                    $scope.route.start = e.get('coords');
                                    console.log('Start:' + $scope.route.start);

                                    this.STATE = this.STATES.WAIT_FINISH;
                                    break;

                                case this.STATES.WAIT_FINISH.value:
                                    $scope.route.finish = e.get('coords');
                                    console.log('Finish:' + $scope.route.finish);

                                    $scope.route.addRoute();

                                    // Очищение
                                    map.events.remove('click', this.addPointCallback);
                                    this.STATE = this.STATES.INACTIVE;
                                    break;
                            }
                        }
                    }
                )
                ;

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


            CardSvc.getRadius($scope);
            $scope.$watch('radius', function (newVal, oldVal) {
                CardSvc.setRadius($scope, newVal);
            });

            $scope.map = map;

            var zoomControl = new ymaps.control.ZoomControl({options: { position: { left: 5, top: 140 }}});
            var geolocationControl = new ymaps.control.GeolocationControl({options: { position: { left: 5, top: 105 }}});

            var searchControl = new ymaps.control.SearchControl({options: { position: { right: 2, top: 10 }, noPlacemark: true, zIndex: 10}});

            $scope.searchControl = searchControl;

            $scope.route = new Route($scope, CardSvc);

            map.controls.add(zoomControl);
            map.controls.add(geolocationControl);
            map.controls.add(searchControl);
            map.controls.add(MyRouteEditor);
//            map.controls.add(searchStartPoint);
//            map.controls.add(searchFinishPoint);

            map.events.add('balloonopen', function (e) {
                var balloon = e.get('balloon');
                map.events.add('click', function (e) {
                    if (e.get('target') === map) { // Если клик был на карте, а не на геообъекте
                        map.balloon.close();
                    }
                });
            });

            /*searchStartPoint.events.add('resultselect', function (e) {
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
                });*/

        };
    }
])
    .
    controller('AdminCtrl', ['$scope', 'CardSvc',
        function ($scope, CardSvc) {


            $scope.name = "Kostya";

        }]);

function MapObjectFilter($scope, CardSvc) {

    this.filterArray = [];
    CardSvc.getTypes($scope);

    //function getFilterFromServer() {
    //    $.get('/getFilters')
    //        .success(function (data) {
    //            filterArray = data;
    //        });
    //
    //}

    this.isChecked = function (indx) {
        var i = this.filterArray.indexOf(indx);
        if (i >= 0)
            return true;
        return false;
    }

    this.switchFilter = function (filter) {
        var indx = filter;
        if (indx) {
            var i = this.filterArray.indexOf(indx);
            if (i >= 0)
                this.filterArray.splice(i, 1);
            else
                this.filterArray.push(indx);
            CardSvc.setTypes($scope, this.filterArray);
        }
    }

    //return {
    //    filters: this.filterArray,
    //    switchFilter: function (i) {
    //        switchFilter(i)
    //    },
    //    isChecked: function (i) {
    //        isChecked(i)
    //    }
    //}
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


    this.addToTrip = function () {
        this.load(parseInt(this.fields.id));
        $scope.route.addPoint(this);
    };
    this.load = function (id) {
        CardSvc.getPlaceInfo($scope, id)
    }
}

function Route($scope, CardSvc) {
    var _start;
    var _finish;
    this.area = null;
    this.multiRoute;

    this.addPoint = function (place) {
        //Координаты добавляемой точки
        var coords = $scope.rom.getRom().objects.getById(place.fields.id).geometry.coordinates;

        var referencePoints = this.multiRoute.model.getReferencePoints();
        /*if(referencePoints.indexOf(coords) >-1)*/
        referencePoints.splice(1, 0, coords);

        //Via point ( для SetReferences необходим массив индексов Via-points)
        var transitArray = [];
        for (var i = 1; i < referencePoints.length - 1; i++) transitArray.push(i);


        this.multiRoute.model.setReferencePoints(referencePoints, transitArray);
    };

    this.addRoute = function () {

        if (!(this._finish && this._start)) return;
        if (this.multiRoute) $scope.map.geoObjects.remove(this.multiRoute);
        var multiRoute = new ymaps.multiRouter.MultiRoute({
            referencePoints: [
                this._start,
                this._finish
            ],
            params: {
                routingMode: 'driving',
                results: 1
                // avoidTrafficJams: true,
            }
        });

        multiRoute.model.events.once("requestchange", function (event) {
            console.log('l');
            var multiRouteModel = event.get("target");
            var firstroute = multiRouteModel.getRoutes()[0];
            if (firstroute)
                CardSvc.setRoute($scope, firstroute);
        });

        multiRoute.model.events.add("requestsuccess", function (event) {
            var multiRouteModel = event.get("target");
            var firstroute = multiRouteModel.getRoutes()[0];

            CardSvc.setRoute($scope, firstroute);
        });

        this.multiRoute = multiRoute;
        $scope.map.geoObjects.add(multiRoute);
    };

    this.clear = function () {
        this.start = undefined;
        this.finish = undefined;
        if (this.multiRoute) {
        }//todo: delete multiRoute
    };

    this.__defineSetter__("start", function (value) {
        this._start = value;
    });

    this.__defineGetter__("start", function () {
        return this._start;
    });

    this.__defineSetter__("finish", function (value) {
        this._finish = value;
    });

    this.__defineGetter__("finish", function () {
        return this._finish;
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

/*
function colorPalette(index)
{
    var _palette = ["#CE5256","#3FBF7A","#AD8255","#2CD3BA","#E5A43B","#D44465","#726868"];
    var _shift = Math.floor(Math.random()*( 31 - 17 ) + 17);
    function _getColor(indx)
    {
        return _palette[(_shift + indx) % _palette.length];
    }

    var str =  "background-color"+ ":"+ _getColor(index)+";"

    return str;
}*/
