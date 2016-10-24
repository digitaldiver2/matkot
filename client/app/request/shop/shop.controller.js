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


  greaterThan (prop, val){
    return function(item){
      return item[prop] > val;
    }
  }

  $onInit () {
  	if (this.id == undefined || this.id == '') {
  		this.$location.path('/');
  		return;
  	} else {
  		this.$http.get('/api/orders/' + this.id).then(response => {
  			this.$scope.request = response.data;
  			var group_id = this.$scope.request.group? this.$scope.request.group._id: '0';
	  		this.$http.get('/api/products/group/' + group_id).then(resp => {
	  			this.$scope.products = resp.data;
	  			this.productmap = this.$scope.products.map(this.mapfct);
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
    var result = this.$scope.request && this.$scope.request.state == 'DRAFT';
    return !result;
  }

  updateOrder (product) {
    var index = -1;
    var productitem = null;

    for (var i=0; i<this.$scope.request.products.length; i++) {
      productitem = this.$scope.request.products[i];
      if (productitem.product._id == product._id) {
        index = i;

        break;
      }
    }

    if (product.ordered != 0) {
      if (index != -1) {
        productitem.ordered = product.ordered;
      } else {
        //add item

        this.$scope.request.products.push({
          'product': product,
          'ordered': product.ordered,
          'unitprice': product.unitprice,
          'approved': 0,
          'received': 0,
          'returned': 0  
        });
      }
    } else {
      if (index != -1) {
        //remove item
        this.$scope.request.products.splice(index, 1);
      } 
        // else impossible state, but do nothing
    }
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
  	if (group == undefined || group.pricecategory == undefined) {
  		pricecategory = '';
  	} else {
  		pricecategory = group.pricecategory;
  	}

  	for (var i=0; i< this.$scope.products.length; i++) {
  		var product = this.$scope.products[i];
		  product.unitprice = product.defaultprice;
      //use same for loop to set ordered quantity default on 0
      product.ordered = 0;
      //if product has custom prices and there is a group specified
  		if (product.prices.length > 0 && pricecategory != '') {
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
  		var index = this.productmap.indexOf(product.product._id);
  		var shopproduct = this.$scope.products[index];
  		shopproduct.ordered = product.ordered;
  	}
  }

  saveProductList () {
    //splice -> clear array
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

  clear (index) {
    var product_id = this.$scope.request.products[index].product._id;
    var productindex = this.productmap.indexOf(product_id);
    this.$scope.products[productindex].ordered = 0;
    this.$scope.request.products.splice(index, 1);
  }
}

angular.module('matkotApp')
  .component('shop', {
    templateUrl: 'app/request/shop/shop.html',
    controller: ShopComponent
  });

})();
