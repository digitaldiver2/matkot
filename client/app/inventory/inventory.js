'use strict';

angular.module('matkotApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('inventory', {
        url: '/inventory',
        template: '<inventory></inventory>'
      });
  });
