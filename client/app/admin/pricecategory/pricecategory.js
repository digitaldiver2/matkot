'use strict';

angular.module('matkotApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('pricecategory', {
        url: '/admin/pricecategory/:id',
        template: '<pricecategory></pricecategory>'
      });
  });
