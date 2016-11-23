'use strict';

angular.module('matkotApp.admin')
  .config(function ($stateProvider) {
    $stateProvider
      .state('productGridEdit', {
        url: '/admin/productGridEdit',
        template: '<product-grid-edit></product-grid-edit>',
        authenticate: 'admin'
      });
  });
