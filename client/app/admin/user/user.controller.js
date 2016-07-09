'use strict';
(function(){

class UserComponent {
  constructor($scope, $http, $stateParams, $location) {
    this.isAdmin = false;

    this.$http = $http;
    this.$scope = $scope;
    this.$location = $location;
    this.$scope.user = {};
    this.$scope.userid = $stateParams.id;
  }

  $onInit() {

    //first, get all groups loaded
    this.$http.get('/api/usergroups').then(response => {
      this.groups = response.data;
      
      //if loading with userid, check all groups that are assigned to the user
      if (this.$scope.userid) {
        this.$http.get('/api/users/admin/' + this.$scope.userid).then(response => {
          this.$scope.user = response.data;
          this.isAdmin = this.$scope.user.role == 'admin';

          //run over all groups and check if needed
          for (var i=0; i<this.$scope.user.groups.length; i++) {
            var usergroup = this.$scope.user.groups[i];
            for (var j=0; j<this.groups.length; j++) {
              if (usergroup._id == this.groups[j]._id) {
                this.groups[j].checked = true;
                break;
              }
            }
          }
        });       
        
      }
    });

  	if (this.$scope.userid) {
	    this.$http.get('/api/users/admin/' + this.$scope.userid).then(response => {
	      this.$scope.user = response.data;
	      this.isAdmin = this.$scope.user.role == 'admin';
	    });
    }
  }

  changerole () {	
  	if (this.isAdmin) {
  		this.$scope.user.role = 'admin';
  	} else {
  		this.$scope.user.role = 'user';
  	}
  }


  getGroups () {
    this.$scope.user.groups = [];
    this.groups.forEach(function (usergroup) {
      if (usergroup.checked) {
        this.$scope.user.groups.push(usergroup._id);
      }
    }, this);
  }

  submit() {
    this.getGroups();
    this.$http.put('/api/users/admin/' + this.$scope.userid, this.$scope.user).then(response => {
    });
    this.$location.path('/admin/users');
  }

  approve(group) {
    var index = this.getIndexById(group._id, this.groups);
    if (index != undefined) {
      this.groups[index].checked = true;
    } 

    this.$scope.user.groups.push(group);
    var index = this.$scope.user.requested_groups.indexOf(group);
    this.$scope.user.requested_groups.splice(index, 1);
  }

  getIndexById (id, array) {
    for (var i=0; i<array.length; i++) {
      var object = array[i];
      if (array[i]._id && array[i]._id == id) {
        return i;
      }
    }
    return undefined;
  }
}

angular.module('matkotApp.admin')
  .component('user', {
    templateUrl: 'app/admin/user/user.html',
    controller: UserComponent
  });

})();
