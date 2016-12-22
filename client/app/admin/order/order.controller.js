'use strict';
(function(){

class OrderComponent {
  constructor($scope, $http, $location, $stateParams, orderService, productService, userService, socket, $q) {
    this.$scope = $scope;
    this.$http = $http;
    this.$location = $location;
    this.id = $stateParams.id;

    this.orderService = orderService;
    this.userService = userService;
    this.productService = productService;
    this.socket = socket;
    this.$q = $q;

    // only used to give an array to the socket sync, and prevent an error of array being undefined
    this.dummyOrders = [];
    this.comment_body = "";
    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('order');
    });

    this.loading = true;

  }

  $onInit () {
    //TODO: don't show page until everything is loaded
    var orderQ = this.orderService.getOrder(this.id);
    var productQ = this.productService.getProducts();
    var categoryQ = this.productService.getPriceCategories();
    var userGroupQ = this.userService.getUserGroups();

    this.$q.all([orderQ, productQ, categoryQ, userGroupQ]).then(answer=> {
      this.order = answer[0];
      this.$scope.products = answer[1];
      this.$scope.pricecategories = answer[2];
      this.$scope.groups = answer[3];

      this.productService.selectCorrectPrice(this.$scope.products, this.order.pricecategory);

      this.prepareOrder();
      this.loading = false;
    }, err => {
      this.errMsg = err;
    });
    
    this.$scope.returnCollapsed = true;
    this.$scope.pickupCollapsed = true;
    this.$scope.eventstartCollapsed = true;
    this.$scope.eventstopCollapsed = true;
    this.$scope.addProductCollapsed = true;

    this.$scope.retouroptions = {
      dateDisabled: this.closedDates
    };
    this.$scope.pickupoptions = {
      dateDisabled: this.closedDates
    }
    this.$scope.closedDates = function (calendarDate, mode) {
      return mode === 'day' && calendarDate.getDay() != 3;
    };

    this.socket.syncUpdates('order', this.dummyOrders, (event, item, list) => {
      //actually only a full update is needed if products or shortages have changed
      var fullReload = true;
      if (item._id == this.order._id) {
        this.ReloadOrder(this.order);
      } else {
        _.merge(this.order, item);
      }
    });
  }

  changedTime() {
    console.log('yo');
  }

  ReloadOrder (order) {
    this.orderService.getOrder(order._id).then(order => {
      this.order = order;
      this.prepareOrder();
    });
  }

  prepareOrder () {
    this.CalculateTotals();
    for (var i=0; i<this.order.products.length; i++) {
      this.orderService.calcProductAvailability(this.order, this.order.products[i].product);
    }
  }

  evaluate () {
    this.orderService.evaluateOrder(this.order);
    this.save();
  }

  CalculateTotals () {
    var estimatedTotal = 0.0;
    var chargedTotal = 0.0;

    for (var i=0; i<this.order.products.length; i++) {
      var product = this.order.products[i];
      estimatedTotal += product.ordered * product.unitprice;
      chargedTotal += product.received * product.unitprice;
    }
  }

  Add (product) {
    this.order.products.push({'product': product, 'unitprice': product.unitprice});
    this.save();
  }


  remove () {
  	var r = confirm("Ben je zeker dat je dit order wilt verwijderen?");
  	if (r == true) {
  		this.$http.delete('/api/orders/' + this.id);
  		this.$location.path('/admin/orders');
  	}
  }

  calculateOrderNumber (prefix, width, number) {
      var strnumber = number.toString();
      var numberlength = strnumber.length;

      var result = prefix;
      for (var i=0; i< width - numberlength; i++) {
        result = result + '0';
      }
      result = result + strnumber;
      return result;
  }

  sameNumbers () {
    if (this.order.state === 'ORDERED') {
      for (var i=0; i<this.order.products.length; i++) {
        var product = this.order.products[i];
        product.approved = product.ordered;
      }
    } else  if (this.order.state === 'APPROVED') {
      for (var i=0; i<this.order.products.length; i++) {
        var product = this.order.products[i];
        product.received = product.approved;
      }
    } else  if (this.order.state === 'DELIVERED') {
      for (var i=0; i<this.order.products.length; i++) {
        var product = this.order.products[i];
        product.returned = product.approved;
      }
    } 
  }

  resetNumbers () {
    if (this.order.state === 'ORDERED') {
      for (var i=0; i<this.order.products.length; i++) {
        var product = this.order.products[i];
        product.approved = 0;
      }
    } else  if (this.order.state === 'APPROVED') {
      for (var i=0; i<this.order.products.length; i++) {
        var product = this.order.products[i];
        product.received = 0;
      }
    } else  if (this.order.state === 'DELIVERED') {
      for (var i=0; i<this.order.products.length; i++) {
        var product = this.order.products[i];
        product.returned = 0;
      }
    } 
  }


  setOrderNumberIfNeeded () {
    if (this.order.state != 'DRAFT' && this.order.ordernumber == undefined) {
      this.settings.ordercounter += 1;
      this.order.ordernumber = this.calculateOrderNumber(this.settings.orderprefix, this.settings.ordernumberwidth, this.settings.ordercounter); 
    }
  }

  save () {
    if (this.order.state != 'DRAFT' && this.order.ordernumber == undefined) {
      this.$http.get('/api/settings').then(response => {
        this.settings = response.data;
        //increase ordernumber
        this.settings.ordercounter += 1;
        this.order.ordernumber = this.calculateOrderNumber(this.settings.orderprefix, this.settings.ordernumberwidth, this.settings.ordercounter); 

        //save order
        this.orderService.saveOrder(this.order).then(resp => {
          //save last ordernumber in settings after success
          this.$http.put('/api/settings/' + this.settings._id, this.settings);
          // this.$location.path('/admin/orders');
        }, err => {
          console.log(err);
          alert(err);
        });
      });
    } else {
      //no ordernumber needed, just save order
      this.orderService.saveOrder(this.order).then(resp => {
        // this.$location.path('/admin/orders');
      }, err => {
        console.log(err);
        alert(err);
      });
    }
  }

  addComment() {
    this.errMsg = '';
    this.orderService.addCommentToOrder(this.order, this.comment_body)
      .then(res => {
        //reload
        this.comment_body = "";
      })
      .catch(err => {
        this.errMsg = err;
      })
  }
}

angular.module('matkotApp.admin')
  .component('order', {
    templateUrl: 'app/admin/order/order.html',
    controller: OrderComponent
  });

})();
