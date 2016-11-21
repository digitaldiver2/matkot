'use strict';
(function(){

class ShopComponent {
  constructor( $http, $stateParams, $location, orderService) {
    this.$http = $http;
    this.$location = $location;
    this.id = $stateParams.id;
    this.products = [];

    this.orderService = orderService;
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
	  		this.$http.get('/api/products/group/' + group_id).then(resp => {
	  			this.products = resp.data;
	  			this.productmap = this.products.map(this.mapfct);
	  			this.selectCorrectPrice();
	  			this.syncProductList();
	  		});

  		});

  		this.$http.get('/api/productfamilies').then(response => {
	  		this.productcategories = response.data;
	  		//set all as default option
	  		var allesID = this.productcategories.push({name:"Alles", _id:0}) - 1;
	  		this.categoryFilter = this.productcategories[allesID];
	  	});
  	}
  }

  updateOrder (product) {
    var index = -1;
    var productitem = null;

    for (var i=0; i<this.order.products.length; i++) {
      productitem = this.order.products[i];
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

        this.order.products.push({
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
        this.order.products.splice(index, 1);
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
  	var group = this.order.group;
  	var pricecategory = undefined;
  	//if group is undefined, use defaults
  	if (group == undefined || group.pricecategory == undefined) {
  		pricecategory = '';
  	} else {
  		pricecategory = group.pricecategory;
  	}

  	for (var i=0; i< this.products.length; i++) {
  		var product = this.products[i];
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
  		this.products[i] = product;
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
  	this.order.products.splice(0, this.order.products.length);
  	for (var i=0; i<this.products.length; i++) {
  		var product = this.products[i];
  		if (product.ordered > 0) {
  			this.order.products.push({
  				'product': product,
  				'ordered': product.ordered,
  				'unitprice': product.unitprice  
  			});
  		}
  	}

  	this.$http.put('/api/orders/' + this.order._id, this.order).then (response => {
      this.$location.path('/orders');
    });
  }

  save () {
  	this.saveProductList();
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
