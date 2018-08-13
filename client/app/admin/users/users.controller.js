'use strict';
(function(){

class UsersComponent {
  constructor($http, $scope, socket, $location, userService, orderService) {
    this.$scope = $scope;
    this.$http = $http;
    this.$location = $location;
    this.userService = userService;
    this.orderService = orderService;
    this.socket = socket;
    this.users = [];
    this.groups = [];
    this.$scope.errmsg = '';

    this.$scope.userSortType = 'name';
    this.$scope.userSortReverse = false;
    this.$scope.groupSortType = 'name';
    this.$scope.groupSortReverse = false;

    this.search = '';

  }

  $onInit() {
    //first get the orders so they are cached
    this.orderService.getOrders().then(() => {
      this.userService.getUsers().then(users => {
        this.users = users;
        this.users.forEach(
          user => this.orderService.getUserOrders(user).then(
            orders => {
              user.orders = orders;
            }
          )
        )
      });
      this.userService.getUserGroups().then(groups => {
        this.groups = groups;
        this.groups.forEach(group => this.orderService.getGroupOrders(group).then(
          orders => group.orders = orders
        ));
      });
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
              this.groups.forEach(group => group.orders = 0);
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
}

angular.module('matkotApp.admin')
  .component('users', {
    templateUrl: 'app/admin/users/users.html',
    controller: UsersComponent
  });

})();
