'use strict';

angular.module('matkotApp.admin')
  .config(function ($stateProvider) {
    $stateProvider
      .state('stockCount', {
        url: '/stockCount',
        template: '<stock-count></stock-count>'
      });
  });
