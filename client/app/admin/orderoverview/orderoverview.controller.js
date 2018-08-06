'use strict';
(function () {

  class OrderoverviewComponent {
    constructor($q, $http, $scope, $location, orderService, productService, userService) {
      this.$q = $q;
      this.$http = $http;
      this.$scope = $scope;
      this.$location = $location;

      this.orderService = orderService;
      this.productService = productService;
      this.userService = userService;

      // query object
      this.q = {};

      this.tabmap = {
        APPROVED: {
          filter: {
            state: 'APPROVED'
          },
          title: 'Aangevraagd',
          showLength: true
        },
        REQUESTED: {
          filter: {
            state: 'ORDERED',
          },
          title: 'Komend',
          showLength: true
        },
        DELIVERED: {
          filter: {
            state: 'DELIVERED',
          },
          title: 'Uitgeleend',
          showLength: true
        },
        SHORTS: {
          filter: {
            state: 'OPEN',
          },
          title: 'Tekorten',
          showLength: true
        },
        DRAFTS: {
          filter: {
            state: 'DRAFT',
          },
          title: 'Concepten',
          showLength: true
        },
        PREVS: {
          filter: {
            state: 'CLOSED',
          },
          title: 'Volledig',
          showLength: true
        },
        SEARCH: {
          filter: this.query,
          title: 'Zoeken',
          showLength: false
        }
      }

      this.tabs = [
        'APPROVED',
        'REQUESTED',
        'DELIVERED',
        'SHORTS',
        'DRAFTS',
        'PREVS',
        'SEARCH'
      ];

      this.currenttab = 'APPROVED';

      this.tabTitle = '';
      this.tabFilter = undefined;
      this.orders = [];
      this.errMsg = undefined;

    }

    $onInit() {
      let orderQ = this.orderService.getOrders();
      let productQ = this.productService.getProducts();
      let categoryQ = this.productService.getPriceCategories();
      let userGroupQ = this.userService.getUserGroups();
      let productFamilyQ = this.productService.getProductFamilies();
      let userQ = this.userService.getUsers();

      this.$q.all([orderQ, productQ, categoryQ, userGroupQ, productFamilyQ, userQ]).then(answer => {
        this.orders = answer[0];
        this.products = answer[1];
        this.pricecategories = answer[2];
        this.groups = answer[3];
        this.productcategories = answer[4];
        this.users = answer[5];

        this.groups.push({name: 'Prive', _id: 'Prive'}, {name: 'All', _id: 'All'});
        // calculate order array lengths for each filter
        this.tabs.forEach(element => {
          let mapItem = this.tabmap[element];
          if (mapItem.showLength) {
            mapItem.length = this.orders.filter(function (order) { return order.state == mapItem.filter.state }).length;
          }
        });
        this.selectTab(this.currenttab);

      }, err => {
        this.errMsg = err;
      });
    }

    query = (order, index, array) => {
      let result = true;
      // user
      if (this.q.owner) {
        result &= this.q.owner._id === order.owner._id;
      }
      if (this.q.group) {
        let tmp = true;
        if (this.q.group._id === 'Prive') {
          tmp = order.hasOwnProperty('group') === false;
        } else if (this.q.group._id === 'All') {
          tmp = true
        } else {
          tmp = order.group && this.q.group._id === order.group._id;
        }
        result &= tmp;
      }
      if (this.q.name) {
        result &= order.name.toLowerCase().search(this.q.name.toLowerCase())> -1;
      }
      return result;
    }

    selectTab(tab) {
      this.currenttab = tab;
      this.tabTitle = this.tabmap[tab].title;
      this.tabFilter = this.tabmap[tab].filter;
    }

    isTabVisible(tab) {
      return this.currenttab === tab;
    }
  }

  angular.module('matkotApp.admin')
    .component('orderoverview', {
      templateUrl: 'app/admin/orderoverview/orderoverview.html',
      controller: OrderoverviewComponent
    });

})();
