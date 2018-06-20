'use strict';
(function () {

  class CompareOrdersComponent {
    constructor($scope, $http, $location, $stateParams, orderService, productService, userService, socket, $q) {
      this.$scope = $scope;
      this.$http = $http;
      this.$location = $location;
      this.orderService = orderService;
      this.productService = productService;
      this.userService = userService;


      this.$scope.format = 'EEE dd/MM/yy';
      this.periodBegin = new Date();
      this.periodEnd = new Date();

      this.popups = {
        'periodBegin': false,
        'periodEnd': false
      }

      this.orders = [];
      this.distinctItems = [];
      this.selectedItem = undefined;

    }

    $onInit() {
    }

    select(item) {
      console.log('selecting item');
      console.dir(item);
      this.selectedItem = item;
    }

    openPopup(popupname) {
      this.popups[popupname] = true;
    }

    calculateOverlappingItems(orders) {
      //return a list of items together with the orders they are needed in.
      /*
      item = {
        product: product,
        orders: [
          {order:order, ordered, approved}
        ]
      }
      */
      this.distinctItems = [];

      //Run over each orderitem.
      this.orders.forEach(order => {
        order.products.forEach(prod_item => {
          // check if it's already in the itemslist
          let distinctItem = this.distinctItems.find(item => item.product._id === prod_item.product._id);

          // create a distinct item if needed
          if (distinctItem === undefined) {
            distinctItem = {
              product: prod_item.product,
              orders: []
            }
            this.distinctItems.push(distinctItem);
          } else {
            console.log('Already in the list!');
          }

          // update the orders items
          const orderEntry = {
            order: order,
            ordered: prod_item.ordered,
            approved: prod_item.approved
          }

          distinctItem.orders.push(orderEntry);

        });
      });
      this.distinctItems = this.distinctItems.filter(item => item.orders.length > 1);

    }

    dataChanged() {

      this.orderService.getOrders().then(orders => {
        this.orders = orders.filter(order => {
          console.log('y')
          return this.orderService.orderInPeriod(order, this.periodBegin, this.periodEnd);
        });

        console.log('x')
        this.calculateOverlappingItems(this.orders);
      });
    }
  }

  angular.module('matkotApp.admin')
    .component('compareorders', {
      templateUrl: 'app/admin/compareorders/compareorders.html',
      controller: CompareOrdersComponent
    });

})();
