'use strict';

angular.module('matkotApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('product', {
        url: '/admin/product/:id',
        template: '<product></product>',
        authenticate: 'admin'
      });
  });
