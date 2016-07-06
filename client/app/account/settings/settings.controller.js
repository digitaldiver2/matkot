'use strict';

class SettingsController {
  constructor(Auth) {
    this.errors = {};
    this.submitted = false;

    this.Auth = Auth;
    this.user = this.Auth.getCurrentUser();
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
}

angular.module('matkotApp')
  .controller('SettingsController', SettingsController);
