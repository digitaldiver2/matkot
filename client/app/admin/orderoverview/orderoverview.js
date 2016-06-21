'use strict';

angular.module('matkotApp.admin')
  .config(function ($stateProvider) {
    $stateProvider
      .state('orderoverview', {
        url: '/admin/orders',
        template: '<orderoverview></orderoverview>',
        authenticate: 'admin'
      });
  });
