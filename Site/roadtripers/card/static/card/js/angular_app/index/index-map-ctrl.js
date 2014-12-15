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
                console.log(data[1].coords);
                $scope.markers = data.coords;
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
         console.log($rootScope.filter);
         for (var i=0; i<$rootScope.filter.length; ++i)
         {
             if($rootScope.filter[i] == e)
             {
                 $rootScope.filter.splice(i,1);
                 return false;
             }
         }
        $rootScope.filter.push(e);
     };
 }]);
