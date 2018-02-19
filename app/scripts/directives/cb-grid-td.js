'use strict';

angular.module('secondarySalesApp')
  .directive('cbGridTd', function () {
    return {
      templateUrl: '/partials/cb-grid-td.html',
      restrict: 'EA',
	    require: '^ngModel',
      scope:{
	      'ngModel': '=',
        'init' : '&testf'
      },
      link: function postLink(scope, element, attrs) {
        //element.text('this is the cbGridTd directive');
      }
    };
  });
