'use strict';
(function(){

class ResetPasswordComponent {
  constructor($stateParams, userService) {
  	this.userService = userService;
    this.token = $stateParams.token;
    this.password = '';
    this.confirm_password = '';
    this.email = '';
    this.errmsg = '';
    this.success = '';
    this.submitted = false;
  }

  resetMsgs() {
  	this.errmsg = '';
  	this.success = '';
  }

  setPassword() {
  	this.resetMsgs();
  	this.userService.resetPassword(this.token, this.password)
  	.then(() => {
  		this.success = 'Wachtwoord is gewijzigd';
  		this.submitted = true;
  	}, (error) => {
  		this.errmsg = error;
  	});
  }

  requestToken() {
  	this.resetMsgs();
  	this.userService.requestToken(this.email)
  	.then(() => {
  		this.success = 'Een email is onderweg om uw wachtwoord te vernieuwen.';
  		this.submitted = true;
  	}, err => {
  		this.errmsg = err;
  	});
  }
}

angular.module('matkotApp')
  .component('resetPassword', {
    templateUrl: 'app/account/resetPassword/resetPassword.html',
    controller: ResetPasswordComponent
  });

})();
