'use strict';
(function(){

class OrderoverviewComponent {
  constructor($http, $scope, $location, orderService) {
  	this.$http = $http;
  	this.$scope = $scope;
    this.$location = $location;
    this.orderService = orderService;

  	this.orders = [];

    this.TAB_APPROVED = 'APPROVED';
    this.TAB_REQUESTED = 'REQUESTED';
    this.TAB_DELIVERED = 'DELIVERED';
    this.TAB_SHORTS = 'SHORTS';
    this.TAB_DRAFTS = 'DRAFTS';
    this.TAB_PREVS = 'PREVS';
    this.TAB_SEARCH = 'SEARCH';

    this.currenttab = this.TAB_REQUESTED;

    //the orders on the selected tab
    this.tabOrders = [];
    this.tabTitle = '';

  }

  $onInit () {
  	this.orderService.getOrders().then (orders => {
  		this.orders = orders;
      this.drafts = this.orders.filter(function (order) { return order.state=='DRAFT'})
      this.requested = this.orders.filter(function (order) { return order.state=='ORDERED'});
      this.approved = this.orders.filter(function (order) { return order.state=='APPROVED'});
      this.delivered = this.orders.filter(function (order) { return order.state=='DELIVERED'});
      this.shorts = this.orders.filter(function (order) { return order.state=='OPEN'});
      this.prevs = this.orders.filter(function (order) { return order.state=='CLOSED'});
      this.others = this.orders.filter(function(order) { 
        return 
          order.state != 'DRAFT' && 
          order.state != 'ORDERED' &&
          order.state != 'APPROVED' &&
          order.state != 'DELIVERED' &&
          order.state != 'OPEN' &&
          order.state != 'CLOSED' })
      this.selectTab(this.currenttab);  
    });
  }

  selectTab(tab) {
    this.currenttab = tab;
    switch (tab) {
      case this.TAB_APPROVED:
        this.tabOrders = this.approved;
        this.tabTitle = 'Aangevraagd';
        break;
      case this.TAB_REQUESTED:
        this.tabOrders = this.requested;
        this.tabTitle = 'Aangevraagd';
        break;
      case this.TAB_DELIVERED:
        this.tabOrders = this.delivered;
        this.tabTitle = 'Uitgeleend';
        break;
      case this.TAB_SHORTS:
        this.tabOrders = this.shorts;
        this.tabTitle = 'Tekorten';
        break;
      case this.TAB_DRAFTS:
        this.tabOrders = this.drafts;
        this.tabTitle = 'Concepten';
        break;
      case this.TAB_PREVS:
        this.tabOrders = this.prevs;
        this.tabTitle = 'Volledig';
        break;
      case this.TAB_SEARCH:
        this.tabOrders = this.orders;
        this.tabTitle = 'Zoeken'
        break;
    }
  }

  isTabVisible(tab) {
    return this.currenttab === tab;
  }

  open (id) {
    this.$location.path('/admin/order/' + id);
  }

  Sort(v1, v2) {
    // todo: handle dates (regex)
    console.log(v1, v2);
    console.log(v1.value, v2.value);
    return naturalSort()(v1.value, v2.value);
  }
}

angular.module('matkotApp.admin')
  .component('orderoverview', {
    templateUrl: 'app/admin/orderoverview/orderoverview.html',
    controller: OrderoverviewComponent
  });

})();
