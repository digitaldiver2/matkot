'use strict';

angular.module('matkotApp.admin')
  .config(function ($stateProvider) {
    $stateProvider
      .state('order', {
        url: '/admin/order/:id',
        template: '<order></order>',
        authenticate: 'admin'
      });
  });
