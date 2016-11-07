'use strict';
(function(){

class OrderComponent {
  constructor($scope, $http, $location, $stateParams, orderService) {
    this.$scope = $scope;
    this.$http = $http;
    this.$location = $location;
    this.id = $stateParams.id;

    this.orderService = orderService;
  }

  $onInit () {
  	this.$http.get('/api/orders/' + this.id).then (resp => {
  		this.$scope.order = resp.data;
  		this.$scope.order.eventstart = new Date(this.$scope.order.eventstart );
        this.$scope.order.eventstop = new Date(this.$scope.order.eventstop );
        this.$scope.order.pickupdate = new Date(this.$scope.order.pickupdate );
        this.$scope.order.returndate = new Date(this.$scope.order.returndate );

        this.CalculateAvailability();
        //get products
        this.$http.get('/api/products').then(resp => {
          this.$scope.products = resp.data;

          this.$http.get('/api/pricecategories').then(response => {
            this.$scope.pricecategories = response.data;
            this.UpdatePriceCategory();
            this.CalculateTotals();
          });
        });
  	});

  	this.$http.get('/api/usergroups').then(response => {
        this.$scope.groups = response.data;
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

    
  }

  UpdatePriceCategory(category) {
    //if category changes, the prices should also change
    for (var i=0; i<this.$scope.products.length; i++) {
      var product = this.$scope.products[i];
      product.unitprice = product.defaultprice ? product.defaultprice : 0.0;
      if (category != null) {
        for (var j=0; j<product.prices.length; j++) {
          if (product.prices[j].Pricecategory == category._id) {
            product.unitprice = product.prices[j].price;
            break;
          }
        }
      }
    }
  }

  HandleProductOverlaps(overlap_order) {
    for (var i=0; i<this.$scope.order.products.length; i++) {
      var productitem = this.$scope.order.products[i];
      var product_id = productitem.product._id;

      if (!productitem.overlaps) {
        productitem.overlaps = [];
      }

      var overlap_productitem = overlap_order.products.find(function (overlap_item) { return overlap_item.product == product_id});
      if (overlap_productitem) {
        var overlap = overlap_productitem;
        overlap.order = {'name': overlap_order.name, 'code': overlap_order.code};
        productitem.overlaps.push(overlap);
      }
    }
  }

  CalculateAvailability () {
    this.$http.get('/api/orders/overlap/' + this.$scope.order._id).then(resp => {
      console.dir(resp.data);
      for (var i=0; i< resp.data.length; i++) {
        var order = resp.data[i];
        this.HandleProductOverlaps(order);
      }
    });
  }

  CalculateTotals () {
    var estimatedTotal = 0.0;
    var chargedTotal = 0.0;

    for (var i=0; i<this.$scope.order.products.length; i++) {
      var product = this.$scope.order.products[i];
      estimatedTotal += product.ordered * product.unitprice;
      chargedTotal += product.received * product.unitprice;
    }

    console.log('estimated total: ' + estimatedTotal);
    console.log('charged total: ' + chargedTotal);
  }

  Add (product) {
    this.$scope.order.products.push({'product': product, 'unitprice': product.unitprice});
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
    if (this.$scope.order.state === 'ORDERED') {
      for (var i=0; i<this.$scope.order.products.length; i++) {
        var product = this.$scope.order.products[i];
        product.approved = product.ordered;
      }
    } else  if (this.$scope.order.state === 'APPROVED') {
      for (var i=0; i<this.$scope.order.products.length; i++) {
        var product = this.$scope.order.products[i];
        product.received = product.approved;
      }
    } else  if (this.$scope.order.state === 'DELIVERED') {
      for (var i=0; i<this.$scope.order.products.length; i++) {
        var product = this.$scope.order.products[i];
        product.returned = product.approved;
      }
    } 
  }

  resetNumbers () {
    if (this.$scope.order.state === 'ORDERED') {
      for (var i=0; i<this.$scope.order.products.length; i++) {
        var product = this.$scope.order.products[i];
        product.approved = 0;
      }
    } else  if (this.$scope.order.state === 'APPROVED') {
      for (var i=0; i<this.$scope.order.products.length; i++) {
        var product = this.$scope.order.products[i];
        product.received = 0;
      }
    } else  if (this.$scope.order.state === 'DELIVERED') {
      for (var i=0; i<this.$scope.order.products.length; i++) {
        var product = this.$scope.order.products[i];
        product.returned = 0;
      }
    } 
  }


  setOrderNumberIfNeeded () {
    if (this.$scope.order.state != 'DRAFT' && this.$scope.order.ordernumber == undefined) {
      this.settings.ordercounter += 1;
      this.$scope.order.ordernumber = this.calculateOrderNumber(this.settings.orderprefix, this.settings.ordernumberwidth, this.settings.ordercounter); 
    }
  }

  save () {


    if (this.$scope.order.state != 'DRAFT' && this.$scope.order.ordernumber == undefined) {
      this.$http.get('/api/settings').then(response => {
        this.settings = response.data;
        //increase ordernumber
        this.settings.ordercounter += 1;
        this.$scope.order.ordernumber = this.calculateOrderNumber(this.settings.orderprefix, this.settings.ordernumberwidth, this.settings.ordercounter); 

        //save order
        this.$http.put('/api/orders/' + this.id, this.$scope.order).then(resp => {
          //save last ordernumber in settings after success
          this.$http.put('/api/settings/' + this.settings._id, this.settings);
          this.$location.path('/admin/orders');
        }, err => {
          console.log(err);
          alert(err);
        });
      });
    } else {
      //no ordernumber needed, just save order
      this.$http.put('/api/orders/' + this.id, this.$scope.order).then(resp => {
        this.$location.path('/admin/orders');
      }, err => {
        console.log(err);
        alert(err);
      });
    }
  }

  addComment(comment) {
    this.errMsg = '';
    this.orderService.addCommentToOrder(this.$scope.order, comment)
      .then(res => {
        //reload
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
