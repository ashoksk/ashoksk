'use strict';

angular.module('secondarySalesApp')
  .directive('cbButtonDelete', function () {
    return {
        templateUrl: '/partials/cb-button-delete.html',
        restrict: 'EA',
        controller: function($scope, $location){
          $scope.rem = function(){
            console.log($scope.singular);
             if (confirm("Are you sure want to delete..!") == true) {
            $scope.singular.remove().then(function() {
              $location.path('/' + $scope.slug);
            });
          }else {
          }
        }
        
        },
        scope: {
          'slug': '@',
          'singular': '='
        },
        link: function postLink(scope, element, attrs) {

        }
      };
  });


    
    