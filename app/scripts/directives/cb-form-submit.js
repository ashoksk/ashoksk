'use strict';

angular.module('secondarySalesApp')
  .directive('cbFormSubmit', function () {
    return {
        templateUrl: '/partials/cb-form-submit.html',
        restrict: 'EA',
        transclude: true,
        controller: function($scope, $location){
          $scope.save = function(){
            console.log('$scope.singular: ', $scope.singular, '$scope.plural ', $scope.plural);
            $scope.plural.post($scope.singular).then(function(){
              console.log('$scope.singular: ', $scope.singular, '$scope.plural ', $scope.plural);
              $scope.plural.push($scope.singular);
              $location.path($scope.slug);
            });
          };
        },
	      scope: {
          'singular': '=',
          'plural': '=',
          'slug': '@',
          'label': '@'
        },
        link: function postLink(scope, element, attrs) {
        /*
        element.bind('click', function(){
        scope.$apply(function(){
        scope.plural.post(scope.singular).then(function(){
        console.log("scope.singular: ", scope.singular, "scope.plural ", scope.plural);
        scope.plural.push(scope.singular);
        });
        });
        });
        */
        }
      };
  });
