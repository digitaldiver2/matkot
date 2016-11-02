'use strict';
(function(){

class OrdersComponent {
  constructor($http, $location, Auth) {
  	this.$http = $http;
  	this.$location = $location;
    console.log('location set: ' + this.$location);
    this.Auth = Auth;
  	this.groups = {};
    this.errmsg = '';

    this.debugtxt = 'hello world';

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
          title:'Order',
          member: 'ordernumber',
          sortable: true
        },
        {
          title:'Status',
          member: 'state',
          sortable: true
        }
      ]
    }
  }

  $onInit () {
    this.Auth.getCurrentUser(user => {
      this.handleUser(user);
    });  	
  }

  handleUser (user) {
    if (user) {
      this.user = user;
      this.groups = this.user.groups;
      this.refreshOrders()
    }
  }

  canBeDeleted (order) {
    return order.state == 'DRAFT' && !order.ordernumber;
  }

  refreshOrders () {
    this.$http.get('/api/orders/user/' + this.user._id).then (response => {
        this.userorders = response.data;
      });
      this.groups.forEach((group) => {
        this.$http.get('/api/orders/group/' + group._id).then(response => {
          group.orders = response.data;
        });
      });
  }


  newOrder () {
  	this.$location.path('/request/terms');
  }

  openOrder (order) {
    console.log('opening order');
    this.$location.path('/request/info/' + order._id);
  }

  deleteOrder (order) {
    this.$http.delete('/api/orders/' + order._id)
      .then (response => {
        console.log('removing..');
        //to refresh
        this.refreshOrders();
      })
      .catch(err => {
        console.dir(err);
        console.log(err.data);
        this.errmsg = err.data;
      });
  }


}

angular.module('matkotApp')
  .component('orders', {
    templateUrl: 'app/orders/orders.html',
    controller: OrdersComponent
  });

})();
