'use strict';
(function(){

class OrdersComponent {
  constructor($http, $scope, $location, Auth) {
  	this.$scope = $scope;
  	this.$http = $http;
  	this.$location = $location;
    this.Auth = Auth;
  	this.$scope.groups = {};
  }

  $onInit () {
    this.Auth.getCurrentUser(user => {
      this.handleUser(user);
    });  	
  }

  handleUser (user) {
    if (user) {
      this.user = user;
      this.$scope.groups = this.user.groups;
      this.$http.get('/api/orders/user/' + this.user._id).then (response => {
        this.$scope.userorders = response.data;
      });
      this.$scope.groups.forEach((group) => {
        this.$http.get('/api/orders/group/' + group._id).then(response => {
          group.orders = response.data;
        });
      });
    }
  }


  newOrder () {
  	this.$location.path('/request/terms');
  }
}

angular.module('matkotApp')
  .component('orders', {
    templateUrl: 'app/orders/orders.html',
    controller: OrdersComponent
  });

})();
