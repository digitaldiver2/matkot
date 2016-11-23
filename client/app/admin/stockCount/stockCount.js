'use strict';

angular.module('matkotApp.admin')
  .config(function ($stateProvider) {
    $stateProvider
      .state('stockCount', {
        url: '/admin/stockCount',
        template: '<stock-count></stock-count>',
        authenticate: 'admin'
      });
  });
