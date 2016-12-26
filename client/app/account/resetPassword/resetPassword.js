'use strict';

angular.module('matkotApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('resetPassword', {
        url: '/resetPassword/:token',
        template: '<reset-password></reset-password>'
      });
  });
