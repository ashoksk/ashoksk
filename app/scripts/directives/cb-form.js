'use strict';

angular.module('secondarySalesApp')
  .directive('cbForm', function($compile) {
  return {
    restrict: 'EA',
    scope: {
      cbFormConfig: '=',
      singular: '=',
      plural: '='
    },
    templateUrl: '/partials/cb-form.html',
    transclude: true,
    link: function(scope, elem, attr, ctrl) {
      console.debug(scope);
      console.debug('el', elem);
    }
  };
});