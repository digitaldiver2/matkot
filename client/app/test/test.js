'use strict';

angular.module('matkotApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('test', {
        url: '/test',
        template: '<test></test>',
        authenticate: 'admin'
      });
  });
