'use strict';

angular.module('secondarySalesApp')
  .directive('cbGrid', function () {
    return {
      templateUrl: '/partials/cb-grid.html',
      restrict: 'EA',
	    require: '^ngModel',
	    scope: {
	      'ngModel': '=',
	      'cbGridConfig': '=',
        'slug' : '@'
	    },
      link: function postLink(scope, element, attrs) {
          //element.text('this is the cbGrid directive');
      }
    };
  });
