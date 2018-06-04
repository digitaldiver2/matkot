'use strict';
(function(){

class GroupComponent {
  constructor($scope, $http, $stateParams, $location, userService) {
  	this.$scope = $scope;
  	this.$http = $http;
  	this.$location = $location;
    this.userService = userService;
  	this.id = $stateParams.id;
    this.$scope.group = undefined;
    this.$scope.pricecategories = undefined;
  }

  $onInit () {
  	if (this.id) {
  		//load group
  		this.$http.get('/api/usergroups/' + this.id).then(response => {
        this.$scope.group = response.data;
        this.sync();
      });
  	} else {
  		//do nothing, group object is already empty
  	}
    this.$http.get('/api/pricecategories').then(response => {
      this.$scope.pricecategories = response.data;
      this.sync();
    });
  }

  sync () {
    if (this.$scope.group != undefined 
      && this.$scope.pricecategories != undefined 
      && this.$scope.group.pricecategory != undefined
      ) {
      for (var i=0; i<this.$scope.pricecategories.length; i++) {
        if (this.$scope.pricecategories[i]._id == this.$scope.group.pricecategory._id) {
          this.$scope.group.pricecategory = this.$scope.pricecategories[i];
        }
      }
    }
  }

  submit () {
  	if (this.id) {
  		this.$http.put('/api/usergroups/' + this.id, this.$scope.group);
  	} else {
      this.$http.post('/api/usergroups', this.$scope.group).then(response => {
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
