'use strict';

angular.module('matkotApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('info', {
        url: '/request/info/:id',
        template: '<info></info>',
        authenticate: 'user'
      });
  });
