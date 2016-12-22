'use strict';
(function(){

class ShopComponent {
  constructor($scope, $http, $stateParams, $location, orderService, productService, socket, $q) {
    this.$http = $http;
    this.$location = $location;
    this.id = $stateParams.id;
    this.products = [];

    this.orderService = orderService;
    this.productService = productService;

    this.socket = socket;
    this.$q = $q;

    this.dummyOrders= [];

    this.comment_body = "";

    this.loading = true;
    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('order');
    });
  }

  $onInit () {
  	if (this.id == undefined || this.id == '') {
  		this.$location.path('/');
  		return;

  	} else {

      var productFamilyQ = this.productService.getProductFamilies();
      var orderQ = this.orderService.getOrder(this.id);

      this.$q.all([productFamilyQ, orderQ]).then(answer=> {
        //handle productcategory
        this.productcategories = answer[0];
        //set all as default option
        var showAllId = this.productcategories.push({name:"Alles", _id:0}) - 1;
        this.categoryFilter = this.productcategories[showAllId];

        //handle order
        this.order = answer[1];
        var group_id = this.order.group? this.order.group._id: '0';
        var price_category_id = this.order.group? this.order.group.pricecategory: undefined;

        this.productService.getGroupProducts(group_id, price_category_id).then(products => {
          this.products = products;
          this.syncProductList();
          this.loading = false;
        });

        //register socket listener
        this.socket.syncUpdates('order', this.dummyOrders, (event, item, list) => {
          if (this.order._id == item._id) {
              console.log('update order');
            this.orderService.getOrder(this.order._id).then(order => {
              this.order = order;
              var group_id = this.order.group? this.order.group._id: '0';
              var price_category_id = this.order.group? this.order.group.pricecategory: undefined;

              this.productService.getGroupProducts(group_id, price_category_id).then(products => {
                this.products = products;
                this.syncProductList();
              });

            });
          }

        });
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
  		var productitem = this.order.products[i];
      var shopproduct = _.find(this.products, {_id: productitem.product._id});
      if (shopproduct) {
    		shopproduct.ordered = productitem.ordered;
      }
  	}
  }

  updateProductInOrder (product) {
    this.orderService.updateOrderProduct(this.order, product);
  }

  instantSave() {
    this.orderService.saveOrder(this.order).then(response => {

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
    var productitem = _.find(this.products, {_id: product_id});
    productitem.ordered = 0;
    this.order.products.splice(index, 1);
    this.instantSave();
  }

  addComment() {
    this.errMsg = '';
    console.log('addcomment');
    if (this.comment_body != "") {
      console.log('we have a comment');
      this.orderService.addCommentToOrder(this.order, this.comment_body)
        .then(res => {
          //reload
          this.comment_body = "";
        })
        .catch(err => {
          this.errMsg = err;
        });
    }
  }
}

angular.module('matkotApp')
  .component('shop', {
    templateUrl: 'app/request/shop/shop.html',
    controller: ShopComponent
  });

})();
