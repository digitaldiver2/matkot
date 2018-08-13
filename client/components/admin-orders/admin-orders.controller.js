'use strict';
(function () {
  class AdminOrdersComponent {
    constructor($scope, $location) {
      this.$location = $location;
      this.$scope = $scope;
      this.columns = [
        {
          title: 'Nr.',
          field: 'ordernumber'
        }, {
          title: 'Order',
          field: 'name'
        }, {
          title: 'Verantw.',
          field: 'owner.name'
        }, {
          title: 'Verenigin.',
          field: 'group.name'
        }, {
          title: 'Van',
          field: 'pickupdate',
          type: 'date'
        }, {
          title: 'Tot',
          field: 'returndate',
          type: 'date'
        }, {
          title: '# prod.',
          field: 'products.length'
        }
      ];
    }

    $onInit() {

    }

    openOrder(order) {
      console.log('open order in admin orders');
      this.$location.path('/admin/order/' + order._id);
    }

    onRemove(order) {
      console.log(`should remove ${order.name}`);
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
