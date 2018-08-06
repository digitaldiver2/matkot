'use strict';
(function () {
  class AdminOrdersComponent {
    constructor($location) {
      this.$location = $location;
    }

    $onInit() {

    }

    open(id) {
      this.$location.path('/admin/order/' + id);
    }

  }

  angular.module('matkotApp.admin')
    .component('adminOrders', {
      templateUrl: 'components/admin-orders/admin-orders.html',
      controller: AdminOrdersComponent,
      bindings: {
        name: '@',
        search: '<',
        orders: '<'
      }
    })
})();
