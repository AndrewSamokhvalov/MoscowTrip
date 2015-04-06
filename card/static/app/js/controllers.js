'use strict';


roadtrippersApp.
    controller('CardCtrl', ['$scope', 'CardSvc',
        function ($scope, CardSvc) {

            $scope.places = function () {
                return $scope.rom.objects.getAll()
            };

            function Filters() {
                var filterArray = [];

                function switchFilter(filter) {
                    var indx = filter;
                    if (indx) {
                        var i = filterArray.indexOf(indx);
//                    console.log(i);
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
                    }
                }
            };


            $scope.filters = new Filters();

            $scope.createROM = function () {

                var MyBalloonLayout = ymaps.templateLayoutFactory.createClass(
                    '$[[options.contentLayout]]'
                    , {
                        /**
                         * Строит экземпляр макета на основе шаблона и добавляет его в родительский HTML-элемент.
                         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/layout.templateBased.Base.xml#build
                         * @function
                         * @name build
                         */
                        build: function () {
                            this.constructor.superclass.build.call(this);

                            this._$element = $('.popover', this.getParentElement());

                            this.applyElementOffset();

//                    this._$element.find('.close')
//                        .on('click', $.proxy(this.onCloseClick, this));
                        },

                        /**
                         * Удаляет содержимое макета из DOM.
                         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/layout.templateBased.Base.xml#clear
                         * @function
                         * @name clear
                         */
                        clear: function () {
                            this._$element.find('.close')
                                .off('click');

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
                                left: -(this._$element[0].offsetWidth / 2),
                                top: -(this._$element[0].offsetHeight + this._$element.find('.arrow')[0].offsetHeight)
                            });
                        },

                        /**
                         * Закрывает балун при клике на крестик, кидая событие "userclose" на макете.
                         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
                         * @function
                         * @name onCloseClick
                         */
//                onCloseClick: function (e) {
//                    e.preventDefault();
//
//                    this.events.fire('userclose');
//                },

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
                    })

                var MyBalloonContentLayout = ymaps.templateLayoutFactory.createClass(
                    '$[properties.balloonContent]'
                );

                this.rom = new ymaps.RemoteObjectManager('getPlaces?bbox=%b',
                    {
                        clusterHasBalloon: false,
                        geoObjectBalloonShadow: false,
                        geoObjectBalloonLayout: MyBalloonLayout,
                        geoObjectBalloonContentLayout: MyBalloonContentLayout,
                        geoObjectBalloonPanelMaxMapArea: 0,
                        geoObjectHideIconOnBalloonOpen: false,
                        geoObjectBalloonOffset: [3, -40]
                    });


                this.rom.objects.events.add('add', function (child) {
                    $scope.$apply();
                });

                this.rom.objects.events.add('remove', function (child) {
                    $scope.$apply();
                });

                this.rom.events.add('click', function (child) {
                    console.log(child);
                });

                this.map.geoObjects.add(this.rom);

            };

            $scope.deleteROM = function () {
                if (this.rom != null) {
                    $scope.map.geoObjects.remove(this.rom);
//                $scope.$apply()
                }

            };

            $scope.updateROM = function () {
                $scope.deleteROM();
                $scope.createROM();
            };

            $scope.init = function (map) {
                this.map = map;

                ymaps.route(['москва метро пролетарская', 'Савёловский']).then(function (route) {
                    CardSvc.setRoute($scope, route);
                });

                this.createROM();

                var zoomControl = new ymaps.control.ZoomControl({options: { position: { left: 5, top: 140 }}});
                var geolocationControl = new ymaps.control.GeolocationControl({options: { position: { left: 5, top: 105 }}})
                var searchControl = new ymaps.control.SearchControl({options: { position: { right: 1, top: 10 }}});
                var routeEditor = new ymaps.control.RouteEditor({options: { position: { left: 40, top: 105 }}});


                routeEditor.events.add('deselect', function () {
                    CardSvc.setRoute($scope, routeEditor.getRoute())
                });

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