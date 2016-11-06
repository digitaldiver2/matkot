'use strict';

angular.module('matkotApp.userService', [])
  .service('userService', function ($http, $q) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    this.getUserGroups = function () {
    	return $http.get('/api/usergroups')
    		.then(res => {
    			return res.data;
    		}, err => {
    			return $q.reject(err.data);
    		});
    }
  });
