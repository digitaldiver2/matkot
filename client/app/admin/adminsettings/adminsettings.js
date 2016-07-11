'use strict';

angular.module('matkotApp.admin')
  .config(function ($stateProvider) {
    $stateProvider
      .state('adminsettings', {
        url: '/admin/adminsettings',
        template: '<adminsettings></adminsettings>',
        authenticate: 'admin'
      });
  });
