'use strict';


roadtrippersApp.controller('CardCtrl', ['$scope','$timeout', 'CardSvc',
    function ($scope, $timeout, CardSvc)
    {
        $scope.filters = new MapObjectFilter($scope,CardSvc);
        $scope.rom = new ROM($scope, CardSvc);

        $scope.UpdateObject = false;
        $scope.wcount = function() {
            $scope.places = function(){ return $scope.rom.rom().objects.getAll() };
            $scope.UpdateObject = true;
        };

        $scope.currentPlace = new Place();

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
]);

roadtrippersApp.controller('managePlacesCtrl', ['$scope', '$location', 'managePlacesCvs',
    function ($scope, $location, managePlacesCvs) {

        $scope.delIndex = 0;

        $scope.getPlaces = function() {
            $scope.places = [];
            managePlacesCvs.getUserPlaces($scope);
        };

        $scope.updatePlaces = function(data) {
            $scope.places = [];
            for(var i in data)
                $scope.places.push(data[i]);
        };

        $scope.deletePlace = function() {
            managePlacesCvs.deleteUserPlace('/deleteUserPlace', $scope.places[$scope.delIndex].id);
            $scope.places.splice($scope.delIndex, 1);
        };

        $scope.getPlaces();

        $scope.addPlace = function() {
            $location.path('/addPlace');
        };
    }
]);

roadtrippersApp.controller('editPlaceCtrl', ['$scope', '$routeParams', 'managePlacesCvs',
    function ($scope, $routeParams, managePlacesCvs) {

        $scope.place = new PlaceForm(managePlacesCvs);
        $scope.usedTags = [];

        managePlacesCvs.getUserPlaceInfo($scope, $routeParams.placeId);

        $scope.updateUsedTags = function(data) {
            $scope.usedTags = data;
        };

        managePlacesCvs.getUsedTags($scope);

        $scope.loadItems = function(query) {
            return $scope.usedTags.filter(function(elem){
                return elem.name.indexOf(query) == 0;
            }).map(function(elem){
                return elem.name;
            });
        };
    }
]);

roadtrippersApp.controller('addPlaceCtrl', ['$scope', 'managePlacesCvs',
    function ($scope, managePlacesCvs) {

        $scope.place = new PlaceForm(managePlacesCvs);

        $scope.updateUsedTags = function(data) {
            $scope.usedTags = data;
        };

        managePlacesCvs.getUsedTags($scope);

         $scope.loadItems = function(query) {
            return $scope.usedTags.filter(function(elem){
                return elem.name.indexOf(query) == 0;
            }).map(function(elem){
                return elem.name;
            });
        };
    }
]);

roadtrippersApp.filter('tableFilter',
    function () {
        return function (arr, searchString) {
            if (!searchString) {
                return arr;
            }

            var result = [];

            searchString = searchString.toLowerCase();

            angular.forEach(arr, function (item) {
                if (item.name.toLowerCase().indexOf(searchString) !== -1) {
                    result.push(item);
                }
            });

            return result;
        }
    });

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

function ROM($scope, CardSvc)
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

        rom.events.add('click', function (event)
        {
            var id = event.get('objectId');
            CardSvc.getPlaceInfo($scope, id);
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
        $scope.wcount();
    };

    this.rom = function()
    {
        if (!rom) this.createROM();
        return rom
    };
}

function Place()
{
    var info = {};

    this.info = info;

    this.update = function update(data)
    {
        for(var i in data[0].fields)
        {
            info[i] = data[0].fields[i];
        }
    }
}

function PlaceForm(managePlacesCvs)
{
    this.place = new Place();
    this.info = this.place.info;

    this.inputStyle = {
        'name': 'form-group',
        'address': 'form-group',
        'description': 'form-group',
        'working_hours': 'form-group',
        'cost': 'form-group',
        'e_mail': 'form-group',
        'website': 'form-group',
        'vk_link': 'form-group',
        'phone': 'form-group',
        'id_tag': 'form-group',
        'main_pic_url': 'form-group'
    };

    this.helpMsg = {
        'name': 'Максимальная длина 100 символов',
        'address': 'Максимальная длина 200 символов',
        'description': 'Максимальная длина 10000 символов',
        'working_hours': 'Максимальная длина 200 символов',
        'cost': 'Целое число или число с двумя знаками после точки',
        'e_mail': 'Максимальная длина 100 символов',
        'website': 'Максимальная длина 100 символов',
        'vk_link': 'Максимальная длина 100 символов',
        'phone': 'Максимальная длина 100 символов',
        'id_tag': 'Длина одного тега от 3 до 100 символов. Разделитель - запятая',
        'main_pic_url': 'Максимальная длина 100 символов'
    };

    this.update = function update(data)
    {
        this.place.update(data);
    };

    this.save = function (url) {
        console.log('save data');
        managePlacesCvs.sendPlaceInfo(url, this.place);
    };

    this.delete = function(url) {
        console.log('delete data');
        managePlacesCvs.deleteUserPlace(url, this.place.info.id);
    }
}