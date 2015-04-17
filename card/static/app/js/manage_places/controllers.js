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

managePlacesApp.controller('editPlaceCtrl', ['$scope', '$location', '$routeParams', 'managePlacesCvs',
    function ($scope, $location, $routeParams, managePlacesCvs) {

        $scope.place = new PlaceForm(managePlacesCvs, $location);
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

managePlacesApp.controller('addPlaceCtrl', ['$scope', '$location', 'managePlacesCvs',
    function ($scope, $location, managePlacesCvs) {

        $scope.place = new PlaceForm(managePlacesCvs, $location);

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

function PlaceForm(managePlacesCvs, $location)
{
    this.info = {
        'images': []
    };

    this.isChanged = {
        'name': false,
        'address': false,
        'description': false,
        'working_hours': false,
        'cost': false,
        'e_mail': false,
        'website': false,
        'vk_link': false,
        'phone': false,
        'id_tag': false,
        'main_pic_url': false
    };

    this.initInputStyle = {
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

    this.initHelpMsg = {
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
        'main_pic_url': 'Максимальная длина 100 символов',
        'images': 'Максимальная длина 100 символов'
    };

    this.inputStyle = angular.copy(this.initInputStyle);

    this.helpMsg = angular.copy(this.initHelpMsg);

    this.update = function update(data)
    {
        for (var i in data[0].fields) {
            this.info[i] = data[0].fields[i];
        }
    };

    this.save = function (url) {
        console.log('save data');
        managePlacesCvs.sendPlaceInfo(url, this, $location);
    };

    this.delete = function(url) {
        console.log('delete data');
        managePlacesCvs.deleteUserPlace(url, this.info.id);
        $location.path('/');
    };

    this.showErrors = function(errors) {
        for (var field in errors) {
            this.inputStyle[field] = this.initInputStyle[field] + ' has-error';
            this.helpMsg[field] = errors[field].join(' ');
            this.isChanged[field] = true;
        }
    };

    this.hideErrors = function(elemId) {
        if (this.isChanged[elemId] == true) {
            this.inputStyle[elemId] = this.initInputStyle[elemId];
            this.helpMsg[elemId] = this.initHelpMsg[elemId];
            this.isChanged[elemId] = false;
        }
    };

    this.addImage = function () {
        this.info.images.push('');
    };
    
    this.deleteImage = function (index) {
        this.info.images.splice(index, 1);
    };
}