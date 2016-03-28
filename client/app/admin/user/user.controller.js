'use strict';
(function(){

class UserComponent {
  constructor($scope, $http, $stateParams) {
    this.user = {};

    this.$http = $http;
    this.$scope = $scope;
    this.$scope.user = {};
    this.$scope.userid = $stateParams.id;
  }

  $onInit() {
  	if (this.$scope.userid) {
	    this.$http.get('/api/users/admin/' + this.$scope.userid).then(response => {
	      this.$scope.user = response.data;
	      this.$scope.user.isAdmin = this.$scope.user.role == 'admin';
	      // this.socket.syncUpdates('thing', this.awesomeThings);
	    });
	}
  }

  changerole () {	
  	console.log('changing role');
  	if (this.$scope.user.isAdmin) {
  		this.$scope.user.role = 'admin';
  		console.log('role to admin');
  	} else {
  		this.$scope.user.role = 'user';
  		console.log('role to user');
  	}
  }
}

angular.module('matkotApp.admin')
  .component('user', {
    templateUrl: 'app/admin/user/user.html',
    controller: UserComponent
  });

})();
