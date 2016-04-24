'use strict';
(function(){

class ProductsComponent {
  constructor($scope, $http, $location) {
    this.$scope = $scope;
    this.$http = $http;
    this.$location = $location;
    this.products = [];
    this.productcategories = [];
  }

  $onInit() {
  	this.$http.get('/api/products').then(response => {
  		this.products = response.data;
  	});
  	this.$http.get('/api/productfamilies').then(response => {
  		this.productcategories = response.data;
  	});
  }

  NewProduct () {
  	this.$location.path('/admin/product/');
  }

  NewGroup () {
  	this.$location.path('/admin/productcategory/');
  }

  DeleteGroup (id) {
  	this.$http.delete('/api/productfamilies/' + id);
  	this.$http.get('/api/productfamilies').then(response => {
  		this.productcategories = response.data;
  	});
  }

  DeleteProduct (id) {
  	//product can only be deleted if there are NO references to it, else it needs to be deactivated
  }
}

angular.module('matkotApp')
  .component('products', {
    templateUrl: 'app/admin/products/products.html',
    controller: ProductsComponent
  });

})();
