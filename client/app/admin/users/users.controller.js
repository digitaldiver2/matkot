'use strict';
(function(){

class UsersComponent {
  constructor($http, $scope, socket, $location) {
    this.$scope = $scope;
    this.$http = $http;
    this.$location = $location;
    this.socket = socket;
    this.users = [];
    this.groups = [];
    this.$scope.errmsg = '';

    this.$scope.userSortType = 'name';
    this.$scope.userSortReverse = false;
    this.$scope.groupSortType = 'name';
    this.$scope.groupSortReverse = false;

    this.search = '';

    this.openUser = function (user) {
      this.$location.path(`/admin/user/${user._id}`);
    }

    this.openGroup = function (group) {
      this.$location.path(`/admin/group/${group._id}`);
    }
  }

  $onInit() {
    this.$http.get('/api/users').then(response => {
      this.users = response.data;
      // this.socket.syncUpdates('thing', this.awesomeThings);
    });

    this.$http.get('/api/usergroups').then(response => {
      this.groups = response.data;
      // this.socket.syncUpdates('thing', this.awesomeThings);
    });
  }

  new_user () {

  }

  new_group () {
    this.$location.path('/admin/group/');
  }

  delete_group (usergroup) {
    var proceed = confirm("Ben je zeker dat je dit item wilt verwijderen? Dit kan niet ongedaan gemaakt worden.");

    if (proceed) {
      this.$http.delete('/api/usergroups/' + usergroup._id)
        .then(response => {
          this.$http.get('/api/usergroups').then(response => {
              this.groups = response.data;
            });
        })
        .catch(err => {
          this.$scope.errmsg = err.data;
        });
    }
  }

  delete_user (user) {
    var proceed = confirm("Ben je zeker dat je dit item wilt verwijderen? Dit kan niet ongedaan gemaakt worden.");

    if (proceed) {
      this.$http.delete('/api/users/' + user._id)
        .then(response => {
          this.$http.get('/api/users').then(response => {
              this.users = response.data;
            });
        })
        .catch(err => {
          this.$scope.errmsg = err.data;
        });
    }
  }
  // addThing() {
  //   if (this.newThing) {
  //     this.$http.post('/api/things', { name: this.newThing });
  //     this.newThing = '';
  //   }
  // }

  // deleteThing(thing) {
  //   this.$http.delete('/api/things/' + thing._id);
  // }


}

angular.module('matkotApp.admin')
  .component('users', {
    templateUrl: 'app/admin/users/users.html',
    controller: UsersComponent,
    controllerAs: 'usersCtrl'
  });

})();
