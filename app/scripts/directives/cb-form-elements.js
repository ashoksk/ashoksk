'use strict';

angular.module('secondarySalesApp')
  .directive('cbFormElements', function($compile) {
  return {
    restrict: 'EA',
    scope: {
      cbFormElementModel: '='
    },
    templateUrl: '/partials/cb-form-elements.html',
    link: function postLink(scope, element, attrs) {
      //element.bind('click', function(){
        console.log('element', element);
      //});
        var el = element.find('.form-control');
        el.attr('data-ng-model', scope.cbFormElementModel.model);
      }
  };
});