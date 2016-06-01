'use strict';
(function(){

class OrdersComponent {
  constructor($http, $scope, $location, Auth) {
  	this.$scope = $scope;
  	this.$http = $http;
  	this.$location = $location;
  	this.user = Auth.getCurrentUser();
  	this.groups = {};
  }

  $onInit () {
  	this.$http.get('/api/orders/user/' + this.user._id).then (response => {
  		this.$scope.userorders = response.data;
  	});
  	for (var i=0; i<this.user.groups.length; i++) {
  		this.$http.get('/api/orders/group/' + this.user.groups[i]._id).then (response => {
  			this.user.groups[i].orders = response.data;
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
