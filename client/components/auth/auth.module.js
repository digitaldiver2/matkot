'use strict';

angular.module('matkotApp.auth', [
  'matkotApp.constants',
  'matkotApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
