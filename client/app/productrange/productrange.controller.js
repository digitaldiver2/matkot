'use strict';
(function(){

class ProductrangeComponent {
  constructor($q, productService) {
    this.productService = productService;
    this.errmsg = '';
  	this.$q = $q;
    this.sortType = '';
    this.sortReverse = false;

    this.loading = true;
    this.products = [];
    this.categoryFilter = null;
    this.sortType = 'name';
  }

  $onInit() {
  	var productQ = this.productService.getProducts();
  	var productFamilyQ = this.productService.getProductFamilies();
  	var priceCategoryQ = this.productService.getPriceCategories();

  	this.$q.all([productQ, productFamilyQ, priceCategoryQ]).then (answers => {
  		this.products = answers[0];
  		this.productFamilies = answers[1];
  		this.priceCategories = answers[2];
		this.loading = false;
		var showAllId = this.productFamilies.push({name:"", _id:0}) - 1;
        this.categoryFilter = this.productFamilies[showAllId];
  	}, err => {
  		this.errmsg = err;
  	});
  }
}

angular.module('matkotApp')
  .component('productrange', {
    templateUrl: 'app/productrange/productrange.html',
    controller: ProductrangeComponent
  });

})();
