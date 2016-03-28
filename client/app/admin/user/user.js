'use strict';

angular.module('matkotApp.admin')
  .config(function ($stateProvider) {
    $stateProvider
      .state('user', {
        url: '/admin/user/:id',
        template: '<user></user>',
        authenticate: 'admin'
      });
  });
