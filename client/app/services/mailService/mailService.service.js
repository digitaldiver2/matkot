'use strict';

angular.module('matkotApp.mailService', [])
  .service('mailService', function ($http, $q) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.sendMail = function(mail) {
    	return $http.post('/api/mail', mail).then(res => {
  			return;
	  	}, err => {
			 $q.reject(err.data);	
	  	});
    }

    // notify materiaal meesters there is a new order
    // this.notifyNewOrder = function(order) {
    //   return $http.post('/api/mail/')
    // }
  });
