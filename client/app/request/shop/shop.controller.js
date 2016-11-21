'use strict';
(function(){

class ShopComponent {
  constructor( $http, $stateParams, $location, orderService, productService) {
    this.$http = $http;
    this.$location = $location;
    this.id = $stateParams.id;
    this.products = [];

    this.orderService = orderService;
    this.productService = productService;
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
      var orderRequest = this.orderService.getOrder(this.id).then(order => {
  			this.order = order;
  			var group_id = this.order.group? this.order.group._id: '0';
        var price_category_id = this.order.group? this.order.group.pricecategory: undefined;
        this.productService.getGroupProducts(group_id, price_category_id).then(products => {
	  			this.products = products;
	  			this.productmap = this.products.map(this.mapfct);
	  			this.syncProductList();
	  		});

  		});

  		this.productService.getProductFamilies().then(families => {
	  		this.productcategories = families;
	  		//set all as default option
	  		var showAllId = this.productcategories.push({name:"Alles", _id:0}) - 1;
	  		this.categoryFilter = this.productcategories[showAllId];
	  	});
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

  syncProductList () {
  	for (var i=0; i <this.order.products.length; i++) {
  		var product = this.order.products[i];
  		var index = this.productmap.indexOf(product.product._id);
  		var shopproduct = this.products[index];
  		shopproduct.ordered = product.ordered;
  	}
  }

  saveProductList () {
    //splice -> clear array
    this.order.products = this.order.products.filter(function (product) {
      return product.ordered > 0;
    });

  	this.$http.put('/api/orders/' + this.order._id, this.order).then (response => {
      this.$location.path('/orders');
    });
  }

  save () {
  	this.orderService.saveOrder(this.order).then (response => {
      this.$location.path('/orders');
    });
  }
  saveAndRequest () {
  	this.order.state = 'ORDERED';
    this.save();
  }

  clear (index) {
    var product_id = this.order.products[index].product._id;
    var productindex = this.productmap.indexOf(product_id);
    this.products[productindex].ordered = 0;
    this.order.products.splice(index, 1);
  }

  addComment(comment) {
    this.errMsg = '';
    this.orderService.addCommentToOrder(this.order, comment)
      .then(res => {
        //reload
      })
      .catch(err => {
        this.errMsg = err;
      })
  }
}

angular.module('matkotApp')
  .component('shop', {
    templateUrl: 'app/request/shop/shop.html',
    controller: ShopComponent
  });

})();
