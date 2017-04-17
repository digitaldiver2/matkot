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

    this.TAB_INFO = 'INFO';
    this.TAB_SHOP = 'SHOP'
    this.TAB_MESSAGES = 'MESSAGES';
    this.TAB_SHORTAGE = 'SHORTAGE';
    this.TAB_CART = 'CART';

    this.currenttab = this.TAB_INFO;
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
        var showAllId = this.productcategories.push({name:"", _id:0}) - 1;
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
        // this.socket.syncUpdates('order', this.dummyOrders, (event, item, list) => {
        //   if (this.order._id == item._id) {
        //       console.log('update order');
        //     this.orderService.getOrder(this.order._id).then(order => {
        //       this.order = order;
        //       var group_id = this.order.group? this.order.group._id: '0';
        //       var price_category_id = this.order.group? this.order.group.pricecategory: undefined;

        //       this.productService.getGroupProducts(group_id, price_category_id).then(products => {
        //         this.products = products;
        //         this.syncProductList();
        //       });

        //     });
        //   }

        // });
      });
  	}
  }

  syncProductList () {
  	this.productService.syncProductsWithOrder(this.products, this.order);
  }

  updateProductInOrder (product) {
    this.orderService.updateOrderProduct(this.order, product);
    // this.instantSave();
  }

  save () {
  	this.orderService.saveOrder(this.order).then (response => {
      this.$location.path('/orders');
    });
  }

  saveAndRequest () {
  	this.order.state = 'ORDERED';
    if (!this.order.requestdate) {
      this.order.requestdate = new Date();
    }
    this.save();
  }

  clear (index) {
    var product_id = this.order.products[index].product._id;
    var productitem = _.find(this.products, {_id: product_id});
    productitem.ordered = 0;
    this.order.products.splice(index, 1);
    // this.instantSave();
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

  selectTab(TAB) {
    // console.log('selectTab:' + TAB);
    this.currenttab = TAB;
  }

  isTabVisible(Tab) {
    // console.log('isTabVisible: ' + Tab + ', current: ' + this.currenttab);
    return this.currenttab === Tab;
  }
}

angular.module('matkotApp')
  .component('shop', {
    templateUrl: 'app/request/shop/shop.html',
    controller: ShopComponent
  });

})();
