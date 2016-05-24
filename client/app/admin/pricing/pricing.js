'use strict';

angular.module('matkotApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('pricing', {
        url: '/admin/pricing',
        template: '<pricing></pricing>',
        authenticate: 'admin'
      });
  });
