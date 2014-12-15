angular.module('index-map-module')
.controller('YMapController',[ '$scope', '$rootScope', '$http', function($scope, $rootScope, $http)
{
    $scope.map = {
        center: [55.75, 37.61], zoom: 10
    };

    $scope.markers = [];
    $rootScope.$watch('filter.length', function(oldValue,newValue)
    {
        if(oldValue != newValue)
        {
            $http.post('/places', {"filters": $rootScope.filter}).
            success(function(data, status, headers, config)
            {
                $scope.markers = data;
            }).
            error(function(data, status, headers, config)
            {
            });
        }
    });
}])
.controller('FilterController',['$scope' , '$rootScope', function ($scope , $rootScope)
 {
     $rootScope.filter =[];
     $scope.functionWithBlackJackAndHoe = function (e)
     {
         var index = $rootScope.filter.indexOf(e)

         if (index  == -1) {
            $rootScope.filter.push(e);
         } else {
            $rootScope.filter.splice(index, 1)
         }

        console.log($rootScope.filter);

     };
 }]);
