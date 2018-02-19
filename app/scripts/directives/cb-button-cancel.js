'use strict';

angular.module('secondarySalesApp')
  .directive('cbButtonCancel', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the cbButtonCancel directive');
      }
    };
  });
