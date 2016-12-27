'use strict';

angular.module('matkotApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main-info', {
        url: '/main-info',
        template: '<main-info></main-info>'
      });
  });
