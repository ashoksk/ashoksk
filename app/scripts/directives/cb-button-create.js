'use strict';

angular.module('secondarySalesApp')
  .directive('cbButtonCreate', function () {
    return {
        templateUrl: '/partials/cb-button-create.html',
        restrict: 'EA',
	      controller: function($location, $scope, $rootScope){
            $scope.setShowForm = function(){
                $location.path('/' + $scope.slug + '/create');
				        $rootScope.$on('$routeChangeSuccess', function(event, next, current) {
                        $scope.showForm = true;
                        console.log($scope.showForm);
					            });
              };
	        },
	      scope: {
            'slug': '@',
            'label': '@'
	        },
          link: function postLink(scope, element, attrs) {
          }
        };
  });
