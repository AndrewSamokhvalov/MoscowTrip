'use strict';


roadtrippersApp.controller('CardCtrl', ['$scope', '$timeout', '$compile', 'CardSvc',
    function ($scope, $timeout, $compile, CardSvc) {
        $scope.filters = [];

        $scope.init = function (map) {
//            // Дочерний класс
//            var MyGeoObject = function (e, t) {
//                MyGeoObject.superclass.constructor.call(this, e, t)
//            };
//
//            ymaps.util.augment(MyGeoObject, ymaps.Balloon, {
//                initCurrentPlace: function () {
//                    $scope.$apply(function () {
//                        $scope.currentPlace = this;
//                    })
//                },
//
//                dataload: function () {
//                    $scope.$apply(function () {
//                        CardSvc.getPlaceInfo($scope, this)
//                    })
//
//                }});
//
//            ymaps.Balloon = MyGeoObject;

            $scope.filters = new MapObjectFilter($scope, CardSvc);
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
            var routeEditor = new ymaps.control.RouteEditor({
                    options: {
                        position: { left: 40, top: 105 }
                    }
                }
            );

            $scope.route = new Route($scope, routeEditor, CardSvc);

            map.controls.add(zoomControl);
            map.controls.add(geolocationControl);
            map.controls.add(searchControl);
            map.controls.add(routeEditor);

            map.events.add('balloonopen', function (e) {
                var balloon = e.get('balloon');
                map.events.add('click', function (e) {
                    if (e.get('target') === map) { // Если клик был на карте, а не на геообъекте
                        map.balloon.close();
                    }
                });
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
        if (i >= 0)
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
                            $scope.rom.places = rom.objects.getAll();
                        }
                    )
                }

//            load = function (id) {
//                var object = $scope.rom.getRom().objects.getById(id);
//                $scope.$apply(function () {
//                    $scope.currentPlace.fields = object.fields;
//                    CardSvc.getPlaceInfo($scope, id)
//                })
//            }
            }
        )
        ;

        rom.objects.events.add('remove', function (event) {
            var isSegmentRemoved = event.get('objectId') < 0;
            if (isSegmentRemoved) {
                $scope.$apply(function () {
                        $scope.rom.places = rom.objects.getAll();
                    }
                )
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
        $scope.$apply(function () {
            $scope.currentPlace.fields = object.fields;
        });
    }

    this.load = function (id) {
        $scope.$apply(function () {
            CardSvc.getPlaceInfo($scope, id)
        })
    }
}
function Route($scope, routeEditor, CardSvc) {

    this.data = null;
    this.area = null;

    ymaps.route(['москва метро пролетарская', 'Савёловский']).then(function (route) {
        CardSvc.setRoute($scope, route);
        console.log('Route added');
    });


    routeEditor.events.add('deselect', function (route) {
        CardSvc.setRoute($scope, routeEditor.getRoute());
    });


}