'use strict';

angular.module('matkotApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('shop', {
        url: '/request/shop/:id',
        template: '<shop></shop>',
        authenticate: 'user'
      });
  });
