'use strict';

angular.module('secondarySalesApp')
  .directive('cbButtonUpdate', function () {
    return {
        templateUrl: '/partials/cb-button-update.html',
        restrict: 'EA',
        scope: {
          'label': '@',
          'slug': '@',
          'singular': '='
        },
	      controller: function($scope, $location){
              $scope.update = function(){
                $scope.singular.put().then(function(){
                    $location.path($scope.slug);
                  });
              };
	          },
        link: function postLink(scope, element, attrs) {
        }
      };
  });
