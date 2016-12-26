'use strict';

class SettingsController {
  constructor(Auth, $http, $q, userService) {
    this.errors = {};
    this.submitted = false;

    this.$q = $q;
    this.userService = userService;

    this.Auth = Auth;

    this.error = undefined;

    // get user and groups
    var userQ = this.Auth.getCurrentUser();
    var groupQ = this.userService.getUserGroups();
    this.$q.all([userQ, groupQ]).then(answer => {
      this.user = answer[0];
      this.groups = answer[1];
      this.updateSelectableGroups();

      var usercpy = jQuery.extend(true, {}, this.user);
    }, error => {
      this.error = error;
    });
  }

  updateSelectableGroups () {
    this.groups.forEach(group => {
      var usergroup = _.find(this.user.groups, {_id: group._id});
      var requestgroup = _.find(this.user.requested_groups, {_id: group._id});
      group.selectable = !usergroup && !requestgroup;
    });
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

  saveAndReload() {
    this.Auth.updateSettings(this.user).then(() => {
      this.message = "Wijzigingen succesvol opgeslagen";
      this.Auth.getCurrentUser(user => {
        this.user = user;
        this.updateSelectableGroups();
        var usercpy = jQuery.extend(true, {}, this.user);
      });
    }, err => {
        this.error = err;
    });
  }

  updateSettings(form) {
    if (form.$valid) {
      this.saveAndReload();
    }
  }

  request_group() {
    if (this.group2request != undefined) {
      this.user.requested_groups.push(this.group2request);
      this.saveAndReload();
    }
  }

  delete_group(object) {
    var index = this.user.groups.indexOf(object);
    if (index > -1) {
      this.user.groups.splice(index,1);
      this.saveAndReload();
    }
  }

  delete_requested_group(object) {
    var index = this.user.requested_groups.indexOf(object);
    if (index > -1) {
      this.user.requested_groups.splice(index,1);
      this.saveAndReload();
    }
  }
}

angular.module('matkotApp')
  .controller('SettingsController', SettingsController);
