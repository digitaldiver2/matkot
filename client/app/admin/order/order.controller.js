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
  	});

  	this.$http.get('/api/usergroups').then(response => {
        this.$scope.groups = response.data;
    });


    this.$scope.returnCollapsed = true;
    this.$scope.pickupCollapsed = true;
    this.$scope.eventstartCollapsed = true;
    this.$scope.eventstopCollapsed = true;

    this.$scope.retouroptions = {
      dateDisabled: this.closedDates
    };
    this.$scope.pickupoptions = {
      dateDisabled: this.closedDates
    }
      
  }

  this.$scope.closedDates = function (calendarDate, mode) {
    return mode === 'day' && calendarDate.getDay() != 3;
  };

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
