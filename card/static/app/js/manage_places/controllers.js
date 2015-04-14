'use strict';

managePlacesApp.controller('managePlacesCtrl', ['$scope', '$location', 'managePlacesCvs',
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

managePlacesApp.controller('editPlaceCtrl', ['$scope', '$routeParams', 'managePlacesCvs',
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

managePlacesApp.controller('addPlaceCtrl', ['$scope', 'managePlacesCvs',
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

managePlacesApp.filter('tableFilter',
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

function PlaceForm(managePlacesCvs)
{
    this.info = {};

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
        for (var i in data[0].fields) {
            this.info[i] = data[0].fields[i];
        }
    };

    this.save = function (url) {
        console.log('save data');
        managePlacesCvs.sendPlaceInfo(url, this.place);
    };

    this.delete = function(url) {
        console.log('delete data');
        managePlacesCvs.deleteUserPlace(url, this.place.info.id);
    };
}