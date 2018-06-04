'use strict';

angular.module('matkotApp.userService', ['matkotApp.mailService'])
    .service('userService', function ($http, $q, mailService, $location) {
        // AngularJS will instantiate a singleton by calling "new" on this function

        this.$q = $q;
        this.$location = $location;
        this.userGroups = undefined;
        this.users = undefined;

        this.getUserGroups = function () {
            // TODO: if usergroups are already available, use the cached ones instead of requesting from the server
            if (this.userGroups == undefined) {
                return $http.get('/api/usergroups')
                    .then(res => {
                        this.userGroups = res.data;
                        return this.userGroups;
                    }, err => {
                        return $q.reject(err.data);
                    });
            } else {
                const deferred = this.$q.defer();
                const promise = deferred.promise;
                deferred.resolve(this.userGroups);
                return promise;
                // return this.userGroups;
            }
        }

        this.getUsers = function () {
            if (this.users == undefined) {
                return $http.get('/api/users/')
                    .then(res => {
                        this.users = res.data;
                        console.log('read new users');
                        return this.users;
                    }, err => {
                        return $q.reject(err.data);
                    });
            } else {
                const deferred = this.$q.defer();
                const promise = deferred.promise;
                deferred.resolve(this.users);
                console.log('cached new users');
                return promise;
            }
        }

        this.getUser = function (id) {
            return this.getUsers().then(users => {
                const x = users.find(user => {
                    return user._id === id;
                });
                return x;
            });
        }

        this.updateUser = function (user) {
            return $http.put('/api/users/admin/' + user._id, user).then(response => {
                const updated_user = response.data;
                const index = this.users.findIndex(_user => {
                    return _user._id === updated_user._id;
                });
                if (index > -1) {
                    this.users[index] = updated_user;
                    console.log('user updated');
                }
            });
        }

        this.openUser = function (user) {
            this.$location.path(`/admin/user/${user._id}`);
        }

        this.openGroup = function (group) {
            this.$location.path(`/admin/group/${group._id}`);
        }

        this.approveGroup = function ($event, user, group) {
            // this function does not save, only modifies the user
            // if group not in user.groups, add it
            if (!user.groups.find(_group => _group._id === group._id)) {
                user.groups.push(group);
            }

            // if group in requested groups, remove it from requested groups
            user.requested_groups = user.requested_groups.filter(_group => {
                return _group._id !== group._id;
            });

            // fix for buttons in rows
            if ($event) $event.stopPropagation();
        }

        this.declineGroup = function($event, user, group) {
            // just remove it from requested_groups
            user.groups = user.groups.filter(_group => {
                return _group._id !== group._id 
            });
            if ($event) $event.stopPropagation();
        }

        this.resetPassword = function (token, password) {
            if (token && password) {
                return $http.put('/api/users/reset/' + token, { 'password': password })
                    .then(res => {
                        return;
                    }, err => {
                        return $q.reject(err.data);
                    });
            } else {
                return $q.reject('token or password missing');
            }
        }

        this.requestToken = function (email) {
            if (email) {
                return $http.get('/api/users/requestreset/' + email)
                    .then(res => {
                        //send email
                        var baseurl = 'http://' + location.host;
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

    });
