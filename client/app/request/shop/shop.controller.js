'use strict';
(function(){

class ShopComponent {
  constructor($scope, $http, $stateParams, $location) {
    this.$scope = $scope;
    this.$http = $http;
    this.$location = $location;
    this.id = $stateParams.id;
    this.$scope.products = [];

  }

  mapfct (x) {
  	return x._id;
  }

  $onInit () {
  	if (this.id == undefined || this.id == '') {
  		this.$location.path('/');
  		return;
  	} else {
  		this.$http.get('/api/orders/' + this.id).then(response => {
  			this.$scope.request = response.data;
  			var group_id = this.$scope.request.group? this.$scope.request.group: '0';
	  		this.$http.get('/api/products/group/' + group_id).then(resp => {
	  			this.$scope.products = resp.data;
	  			this.productmap = this.$scope.products.map(this.mapfct);
	  			this.$scope.productmap = this.$scope.products.map(this.mapfct);
	  			this.selectCorrectPrice();
	  			this.syncProductList();
	  		});

  		});

  		this.$http.get('/api/productfamilies').then(response => {
	  		this.productcategories = response.data;
	  		//set all as default option
	  		var allesID = this.productcategories.push({name:"Alles", _id:0}) - 1;
	  		this.$scope.categoryFilter = this.productcategories[allesID];
	  	});
  	}
  }

  isNoDraft () {
    var result = this.$scope.request && this.$scope.request.state == 'DRAFT'
    console.log("is draft?" + result);
    return !result;
  }

  matchByGroup = function (category) {
  	return function (product) {
  		if (category == undefined) {
  			return false;
  		}
  		if (category._id == 0) {//all
  			return true;
  		} else {
  			return product.productfamily.indexOf(category._id) > -1;
  		}
  	}
  }

  selectCorrectPrice () {
  	var group = this.$scope.request.group;
  	var pricecategory = undefined;
  	//if group is undefined, use defaults
  	if (group == undefined) {
  		pricecategory = '';
  	} else {
  		pricecategory = group.pricecategory;
  	}
  	for (var i=0; i< this.$scope.products.length; i++) {
  		var product = this.$scope.products[i];
		product.unitprice = product.defaultprice;
  		if (product.prices.length > 0) {
  			for (var j=0; j<product.prices.length; j++) {
  				if (product.prices[j].pricecategory == pricecategory._id) {
  					product.unitprice = product.prices[j].price;
  				}
  			}
  		}
  		this.$scope.products[i] = product;
  	}
  }

  syncProductList () {
  	for (var i=0; i <this.$scope.request.products.length; i++) {
  		var product = this.$scope.request.products[i];
  		var index = this.productmap.indexOf(product.product);
  		var shopproduct = this.$scope.products[index];
  		shopproduct.ordered = product.ordered;
  	}
  }

  saveProductList () {
  	this.$scope.request.products.splice(0, this.$scope.request.products.length);
  	for (var i=0; i<this.$scope.products.length; i++) {
  		var product = this.$scope.products[i];
  		if (product.ordered > 0) {
  			this.$scope.request.products.push({
  				'product': product,
  				'ordered': product.ordered,
  				'unitprice': product.unitprice  
  			});
  		}
  	}

  	this.$http.put('/api/orders/' + this.$scope.request._id, this.$scope.request).then (response => {
      alert('request saved');
      this.$location.path('/orders');
    });
  }

  save () {
  	this.saveProductList();
  }
  saveAndRequest () {
  	this.$scope.request.state = 'ORDERED';
    this.save();
  }
}

angular.module('matkotApp')
  .component('shop', {
    templateUrl: 'app/request/shop/shop.html',
    controller: ShopComponent
  });

})();
