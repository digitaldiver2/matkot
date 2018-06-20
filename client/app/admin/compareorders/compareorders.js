'use strict';

angular.module('matkotApp.admin')
  .config(function ($stateProvider) {
    $stateProvider
      .state('compareorders', {
        url: '/admin/compareorders',
        template: '<compareorders></compareorders>',
        authenticate: 'admin'
      });
  });
