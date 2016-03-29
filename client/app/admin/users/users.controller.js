'use strict';
(function(){

class UsersComponent {
  constructor($http, $scope, socket, $location) {
    this.$http = $http;
    this.$location = $location;
    this.socket = socket;
    this.users = [];
    this.groups = [];
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
