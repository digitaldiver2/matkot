'use strict';

angular.module('matkotApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('products', {
        url: '/admin/products',
        template: '<products></products>'
      });
  });
