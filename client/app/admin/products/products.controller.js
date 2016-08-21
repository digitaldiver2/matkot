'use strict';
(function(){

class ProductsComponent {
  constructor($scope, $http, $location) {
    this.$scope = $scope;
    this.$http = $http;
    this.$location = $location;
    this.products = [];
    this.productcategories = [];
    this.$scope.errmsg = '';
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
    var proceed = confirm("Ben je zeker dat je dit item wilt verwijderen? Dit kan niet ongedaan gemaakt worden.");

    if (proceed) {
    	this.$http.delete('/api/productfamilies/' + id)
        .then(response => {
          this.$http.get('/api/productfamilies').then(response => {
              this.productcategories = response.data;
            });
        })
        .catch(err => {
          this.$scope.errmsg = err.data;
        });
    }
  }

  DeleteProduct (id) {
    var proceed = confirm("Ben je zeker dat je dit item wilt verwijderen? Dit kan niet ongedaan gemaakt worden.");

    if (proceed) {
    	//product can only be deleted if there are NO references to it, else it needs to be deactivated
      this.$http.delete('/api/products/' + id)
        .then(response => {
          this.$http.get('/api/products')
            .then(response => {
              this.products = response.data;
            });
        })
        .catch(err => {
          this.$scope.errmsg = err.data;
        });
    } 
  }
}

angular.module('matkotApp')
  .component('products', {
    templateUrl: 'app/admin/products/products.html',
    controller: ProductsComponent
  });

})();
