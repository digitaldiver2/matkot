'use strict';

class SettingsController {
  constructor(Auth, $http) {
    this.errors = {};
    this.submitted = false;

    this.Auth = Auth;
    this.user = this.Auth.getCurrentUser();

    $http.get('/api/usergroups').then(response => {
      this.groups = response.data;
      this.unused_groups = undefined;
      this.remove_groups();
    });
  }

  remove_groups() {
    for (var i=0; i<this.groups.length; i++) {
      var current_group = this.groups[i];
      current_group.selectable = true;

      for (var j=0; j<this.user.groups.length; j++) {
        var usergroup = this.user.groups[j];
        if (usergroup._id == current_group._id) {
            current_group.selectable = false;
            break;
        }
      }

      if (current_group.selectable) {
        for (var j=0; j<this.user.requested_groups.length; j++) {
          var usergroup = this.user.requested_groups[j];
          if (usergroup._id == current_group._id) {
              current_group.selectable = false;
              break;
          }
        }
      }
    }
  }

  changePassword(form) {
    this.submitted = true;

    if (form.$valid) {
      this.Auth.changePassword(this.user.oldPassword, this.user.newPassword)
        .then(() => {
          this.message = 'Password successfully changed.';
        })
        .catch(() => {
          form.password.$setValidity('mongoose', false);
          this.errors.other = 'Incorrect password';
          this.message = '';
        });
    }
  }

  updateSettings(form) {
    if (form.$valid) {
      this.Auth.updateSettings(this.user)
        .then(() => {
          this.message = 'Settings successfully changed.';
        })
        .catch(() => {
          this.errors.other = 'error updating settings';
          this.message = 'errormessage updating settings';
        });
    }
  }

  request_group() {
    if (this.group2request != undefined) {
      this.user.requested_groups.push(this.group2request);
      this.remove_groups();
    }
  }

  delete_group(object) {
    var index = this.user.groups.indexOf(object);
    if (index > -1) {
      this.user.groups.splice(index,1);
      this.remove_groups();
    }
  }

  delete_requested_group(object) {
    var index = this.user.requested_groups.indexOf(object);
    if (index > -1) {
      this.user.requested_groups.splice(index,1);
      this.remove_groups();
    }
  }
}

angular.module('matkotApp')
  .controller('SettingsController', SettingsController);
