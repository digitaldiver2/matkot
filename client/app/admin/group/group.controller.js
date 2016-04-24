'use strict';
(function(){

class GroupComponent {
  constructor($scope, $http, $stateParams, $location) {
  	this.$scope = $scope;
  	this.$http = $http;
  	this.$location = $location;
  	this.id = $stateParams.id;

  	this.group = {};
  }

  $onInit () {
  	if (this.id) {
  		//load group
  		this.$http.get('/api/usergroups/' + this.id).then(response => {this.group = response.data});
  	} else {
  		//do nothing, group object is already empty
  	}
  }

  submit () {
  	if (this.id) {
  		this.$http.put('/api/usergroups/' + this.id, this.group);
  	} else {
      this.$http.post('/api/usergroups', this.group).then(response => {
	  	// this.$location.path('/admin/group/' + response.data._id);
      });
    }
    this.$location.path('/admin/users');

  }
}

angular.module('matkotApp.admin')
  .component('group', {
    templateUrl: 'app/admin/group/group.html',
    controller: GroupComponent
  });

})();
