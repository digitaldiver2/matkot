'use strict';

angular.module('matkotApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('productrange', {
        url: '/productrange',
        template: '<productrange></productrange>',
        authenticate: 'user'
      });
  });
