'use strict';
(function(){

class OrderComponent {
  constructor($scope, $http, $location, $stateParams) {
    this.$scope = $scope;
    this.$http = $http;
    this.$location = $location;
    this.id = $stateParams.id;
  }

  $onInit () {
  	this.$http.get('/api/orders/' + this.id).then (resp => {
  		this.$scope.order = resp.data;
  		console.log(this.$scope.order.group);
  		this.$scope.order.eventstart = new Date(this.$scope.order.eventstart );
        this.$scope.order.eventstop = new Date(this.$scope.order.eventstop );
        this.$scope.order.pickupdate = new Date(this.$scope.order.pickupdate );
        this.$scope.order.returndate = new Date(this.$scope.order.returndate );
  	});

  	this.$http.get('/api/usergroups').then(response => {
        this.$scope.groups = response.data;
    });
  }

  remove () {
  	var r = confirm("Ben je zeker dat je dit order wilt verwijderen?");
  	if (r == true) {
  		this.$http.delete('/api/orders/' + this.id);
  		this.$location.path('/admin/orders');
  	}
  }
}

angular.module('matkotApp.admin')
  .component('order', {
    templateUrl: 'app/admin/order/order.html',
    controller: OrderComponent
  });

})();
