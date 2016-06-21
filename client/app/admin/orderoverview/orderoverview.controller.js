'use strict';
(function(){

class OrderoverviewComponent {
  constructor($http, $scope, $location) {
  	this.$http = $http;
  	this.$scope = $scope;
    this.$location = $location;

  	this.orders = [];
  }

  $onInit () {
  	this.$http.get('/api/orders').then (resp => {
  		this.orders = resp.data;
      this.requested = this.orders.filter(function (order) { return order.state=='ORDERED'});
      this.approved = this.orders.filter(function (order) { return order.state=='APPROVED'});
      this.delivered = this.orders.filter(function (order) { return order.state=='DELIVERED'});
      this.shorts = this.orders.filter(function (order) { return order.state=='SHORTAGE'});
      this.prevs = this.orders.filter(function (order) { return order.state=='CLOSED'});
  	});
  }

  open (index) {
    console.log(index);
    this.$location.path('/admin/order/' + this.orders[index]._id);
  }
}

angular.module('matkotApp.admin')
  .component('orderoverview', {
    templateUrl: 'app/admin/orderoverview/orderoverview.html',
    controller: OrderoverviewComponent
  });

})();
