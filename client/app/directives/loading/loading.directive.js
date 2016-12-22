'use strict';

angular.module('matkotApp')
  .directive('loading', function () {
    return {
      templateUrl: 'app/directives/loading/loading.html',
      restrict: 'E',
      link: function (scope, element, attrs) {
      },
      scope: {
      	show: '='
      },
      transclude: true
    };
  });
