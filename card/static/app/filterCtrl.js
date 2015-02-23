app.controller('filterCtrl',function ($scope, $rootScope) {
     $rootScope.filter = [];
     $scope.updateMarkers = function(e) {
         var index = $rootScope.filter.indexOf(e);
         if (index  == -1) {
            $rootScope.filter.push(e);
         } else {
            $rootScope.filter.splice(index, 1);
         }
     }
 });