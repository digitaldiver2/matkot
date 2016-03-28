'use strict';

angular.module('matkotApp.admin')
  .config(function ($stateProvider) {
    $stateProvider
      .state('users', {
        url: '/admin/users',
        template: '<users></users>',
        authenticate: 'admin'
      });
  });
