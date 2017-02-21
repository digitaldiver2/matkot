'use strict';

angular.module('matkotApp.userService', ['matkotApp.mailService'])
  .service('userService', function ($http, $q, mailService) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    this.getUserGroups = function () {
    	return $http.get('/api/usergroups')
    		.then(res => {
    			return res.data;
    		}, err => {
    			return $q.reject(err.data);
    		});
    }

    this.resetPassword = function(token, password) {
        if (token && password) {
            return $http.put('/api/users/reset/' + token, {'password': password})
                .then(res => {
                    return;
                }, err => {
                    return $q.reject(err.data);
                });
        } else {
            return $q.reject('token or password missing');
        }
    }

    this.requestToken = function(email) {
        if (email) {
            return $http.get('/api/users/requestreset/' + email)
                .then(res => {
                    //send email
                    var baseurl = 'http://141.134.134.21:9080';
                    var token = res.data['token']; 
                    var mail = {
                        to: email,
                        subject: 'Wachtwoord reset',
                        body: 'Via volgende link kan u uw wachtwoord wijzigen: \r\n ' + baseurl + '/resetPassword/' + token
                    }

                    mailService.sendMail(mail)
                    .then(() => {
                        return;
                    }, err => {
                        return $q.reject(err.data);
                    });
                    return;
                }, err => {
                    return $q.reject(err.data);
                });
        } else {
            return $q.reject('no emailaddress supplied');
        }
    }

    this.getUsers = function() {
        return $http.get('/api/users/')
            .then(res => {
                return res.data;
            }, err => {
                return $q.reject(err.data);
            });
    }

  });
