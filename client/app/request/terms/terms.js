'use strict';

angular.module('matkotApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('terms', {
        url: '/request/terms',
        template: '<terms></terms>'
      });
  });
