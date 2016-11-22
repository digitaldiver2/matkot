'use strict';

angular.module('matkotApp.admin')
  .config(function ($stateProvider) {
    $stateProvider
      .state('productGridEdit', {
        url: '/productGridEdit',
        template: '<product-grid-edit></product-grid-edit>'
      });
  });
