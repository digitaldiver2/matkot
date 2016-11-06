'use strict';

angular.module('matkotApp', [
  'matkotApp.auth',
  'matkotApp.admin',
  'matkotApp.constants',
  'matkotApp.userService',
  'matkotApp.productService',
  'matkotApp.orderService',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'validation.match'
])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });
