'use strict';
(function () {

  class OrdersComponent {
    constructor($http, $location, Auth, orderService) {
      this.$http = $http;
      this.$location = $location;
      this.Auth = Auth;
      this.errMsg = '';
      this.successMsg = '';

      this.orderService = orderService;

      this.listOptions = {
        itemClickEvent: this.openOrder,
        orderByColumn: 'ordernumber',
        columns: [
          {
            title: 'Naam',
            member: 'name',
            sortable: true,
          },
          {
            title: 'Order',
            member: 'ordernumber',
            sortable: true
          },
          {
            title: 'Status',
            member: 'state',
            sortable: true
          },
          {
            title: 'Vereniging',
            // member: 'group["name"]',
            member: 'group.name',
            sortable: true
          }
        ]
      }
    }

    $onInit() {
      this.Auth.getCurrentUser(user => {
        if (user) {
          this.user = user;
          this.refreshOrders()
        }
      });
    }

    refreshOrders() {
      this.errMsg = '';
      this.successMsg = '';

      this.orderService.getUserOrders(this.user._id).then(orders => {
        this.userorders = orders;
      })
        .catch(err => {
          this.errMsg += err.data;
        });

      this.user.groups.forEach((group) => {
        this.orderService.getGroupOrders(group._id).then(orders => {
          group.orders = orders;
        })
          .catch(err => {
            this.errMsg = err.data;
          });
      });
    }


    newOrder() {
      this.$location.path('/request/terms');
    }

    openOrder(order) {
      this.$location.path('/request/info/' + order._id);
    }

    deleteOrder(order) {
      this.orderService.deleteOrder(order)
        .then(response => {
          this.successMsg = response.data;
        })
        .catch(err => {
          this.errMsg = err.data;
        })
        .finally(() => {
          this.refreshOrders();
        });
    }


  }

  angular.module('matkotApp')
    .component('orders', {
      templateUrl: 'app/orders/orders.html',
      controller: OrdersComponent
    });

})();
