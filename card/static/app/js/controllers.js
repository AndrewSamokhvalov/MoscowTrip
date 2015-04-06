'use strict';


roadtrippersApp.controller('CardCtrl', ['$scope', 'CardSvc',
    function ($scope, CardSvc)
    {
        $scope.filters = new MapObjectFilter($scope,CardSvc);

        $scope.rom = new ROM($scope);

        $scope.places = function(){ return $scope.rom.rom.objects.getAll() };

        $scope.init = function(map)
        {
            $scope.map = map;

            ymaps.route(['москва метро пролетарская', 'Савёловский']).then(function (route) {
                CardSvc.setRoute($scope, route);
            });

            var zoomControl = new ymaps.control.ZoomControl({options: { position: { left: 5, top: 140 }}});
            var geolocationControl = new ymaps.control.GeolocationControl({options: { position: { left: 5, top: 105 }}});
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
        $scope.placeUpdate = function()
        {
            $scope.places = [];
            $scope.rom.rom.objects.each(function(place){ $scope.places.push(place.fields)})
        }

    }
])
.controller('AdminCtrl', ['$scope', 'CardSvc',
function ($scope, CardSvc) {


    $scope.name = "Kostya";

}]);

function MapObjectFilter($scope,CardSvc)
{
    var filterArray = [];

    function getFilterFromServer()
    {
        $.get('/getFilters')
         .success( function (data)
         {
             filterArray = data;
         });

    }

    function isChecked(indx)
    {
        var i = filterArray.indexOf(indx);
        if (i >= 0)
            return true;
        return false;
    }

    function switchFilter(filter)
    {
        var indx = filter;
        if (indx)
        {
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
        switchFilter: function(i){switchFilter(i)},
        isChecked: function(i){isChecked(i)}
    }
}

function ROM($scope)
{
    var rom;

    this.createROM = function ()
    {
        var MyBalloonLayout = ymaps.templateLayoutFactory.createClass
        (
            '$[[options.contentLayout]]',
            {

                build: function () {
                    this.constructor.superclass.build.call(this);

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
                        top: -(this._$element[0].offsetHeight + 30)
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

        var MyBalloonContentLayout = ymaps.templateLayoutFactory.createClass(
            '$[properties.balloonContent]'
        );

        rom = new ymaps.RemoteObjectManager('getPlaces?bbox=%b',
        {
            clusterHasBalloon: false,
            geoObjectBalloonShadow: false,
            geoObjectBalloonLayout: MyBalloonLayout,
            geoObjectBalloonContentLayout: MyBalloonContentLayout,
            geoObjectBalloonPanelMaxMapArea: 0,
            geoObjectHideIconOnBalloonOpen: false,
            geoObjectBalloonOffset: [3, 0]
        });


        rom.objects.events.add('add', function (child) {
            $scope.$apply();
        });

        rom.objects.events.add('remove', function (child) {
            $scope.$apply();
        });

        rom.events.add('click', function (child) {
            console.log(child);
        });

        $scope.map.geoObjects.add(rom);

    };

    var deleteROM = function deleteROM()
    {
        if(rom != null) {
            $scope.map.geoObjects.remove(rom);
//                $scope.$apply()
        }

    };

    this.updateROM = function()
    {
        deleteROM();
        this.createROM();
    };

    this.rom = function()
    {
        if (!rom) this.createROM();
        return rom
    };
}