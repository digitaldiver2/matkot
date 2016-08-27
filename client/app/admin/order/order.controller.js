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

  CalculateAvailability() {
    console.log('calc availability');
    for (var i=0; i<this.$scope.order.products.length; i++) {
      var product = this.$scope.order.products[i].product;
      this.$http.get('/api/orders/overlap/' + this.id + '/' + product._id).then(resp => {
        product.overlaps = resp.data;
        console.dir(product.overlaps);
        for (var j=0; j<product.overlaps.length; j++) {
          product.overlaps[j].product = product.overlaps[j].products.filter(this.overlapProductReduce(product));
          console.log('ok');
        }
      });
    }
  }

  overlapProductReduce(refproduct) {
    return function (prod) {
      return prod.product._id == refproduct._id;
    }
  }

  Add (product) {
    this.$scope.order.products.push({'product': product});
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
}

angular.module('matkotApp.admin')
  .component('order', {
    templateUrl: 'app/admin/order/order.html',
    controller: OrderComponent
  });

})();
