'use strict';

angular.module('secondarySalesApp')
  .directive('cbButtonEdit', function () {
    return {
        templateUrl: '/partials/cb-button-edit.html',
        restrict: 'EA',
        transclude: true,
	      require: '^ngModel',
	      controller: function($location, $scope){
            $scope.setLocation = function(){
                $location.path('/' + $scope.slug + '/' + $scope.ngModel);
              };
	        },
	      scope: {
	        ngModel: '=',
          'slug': '@'
	      },
        link: function postLink(scope, element, attrs) {
        }
      };
  });
