'use strict';

angular.module('matkotApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('productcategory', {
        url: '/admin/productcategory/:id',
        template: '<productcategory></productcategory>'
      });
  });
