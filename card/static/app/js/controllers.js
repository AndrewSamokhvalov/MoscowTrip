'use strict';

roadtrippersApp.controller('CardCtrl', ['$scope', 'CardSvc',
    function ($scope, CardSvc)
    {
        $scope.filters = new MapObjectFilter($scope,CardSvc);

        $scope.rom = new ROM($scope);

        $scope.openModal = function()
        {
            document.getElementById('parent_popup').style.display='block';
            document.getElementById('popup').style.display='block';
        };

        $scope.init = function(map)
        {
            $scope.map = map;

            ymaps.route(['москва метро пролетарская', 'Савёловский']).then(function (route) {
                CardSvc.setRoute($scope, route);
            });

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
        };

        $scope.placeUpdate = function()
        {
            $scope.places = [];
            $scope.rom.rom.objects.each(function(place){ $scope.places.push(place.fields)})
        }

    }
]);

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

    this.createROM = function()
    {
        rom = new ymaps.RemoteObjectManager('getPlaces?bbox=%b',
            {
                clusterHasBalloon: false
            });

        rom.objects.events.add('add', function(child) {
            $scope.$apply();
        });

        rom.objects.events.add('remove', function(child) {
            $scope.$apply();
        });

        rom.events.add('click', function(child) {
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

    this.updateROM = function(){
        deleteROM();
        this.createROM();
    };

    this.rom = function()
    {
        if (!rom) this.createROM();
        return rom
    };
}