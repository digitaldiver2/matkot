'use strict';
(function(){

class StockCountComponent {
  constructor($q, productService, socket, $scope) {
    this.message = 'Hello';
  	this.productService = productService;
  	this.state = 'init';
  	this.errmsg = '';
  	this.$q = $q;
  	this.socket = socket;
    this.reason = 'jaartelling';

  	$scope.$on('$destroy', function () {
  		socket.unsyncUpdates('product');
  	});
  }

  $onInit() {
  	var productQ = this.productService.getProducts();
  	var productFamilyQ = this.productService.getProductFamilies();
  	var priceCategoryQ = this.productService.getPriceCategories();

  	this.$q.all([productQ, productFamilyQ, priceCategoryQ]).then (answers => {
  		this.products = answers[0];
  		this.productFamilies = answers[1];
  		this.priceCategories = answers[2];
  		this.socket.syncUpdates('product', this.products);
  		this.state = 'ready';
  	}, err => {
  		this.errmsg = err;
  	});
  }

  updateStock (product, reason) {
  	this.productService.changeProductStock(product, product.new_stock, reason);
  }
}

angular.module('matkotApp.admin')
  .component('stockCount', {
    templateUrl: 'app/admin/stockCount/stockCount.html',
    controller: StockCountComponent
  });

})();
