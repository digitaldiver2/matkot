'use strict';

angular.module('matkotApp.admin')
  .config(function ($stateProvider) {
    $stateProvider
      .state('group', {
        url: '/admin/group/:id',
        template: '<group></group>'
      });
  });
