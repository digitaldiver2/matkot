'use strict';
(function(){

class TestComponent {
  constructor($http, $scope) {
    this.$http = $http;
    this.$scope = $scope;

    this.mail = {};

    this.mails = [];
  }

  $onInit() {
  	this.$http.get('/api/mail').then(res =>{
  		this.mails = res.data;
  	}, err => {
  		console.log('failed to load data');
  	});
  }

  sendmail() {
  	console.log('trying to send email');
  	this.$http.post('/api/mail', this.mail).then(res => {
  		console.log('success');
  		this.mail = {};
  	}, err => {
  		console.log('error: ' + err);
  	});
  }
}

angular.module('matkotApp')
  .component('test', {
    templateUrl: 'app/test/test.html',
    controller: TestComponent
  });

})();
