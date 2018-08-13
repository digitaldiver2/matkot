'use strict';
(function(){

class ProductsComponent {
  constructor($scope, $http, $location, productService, stateService) {
    this.$scope = $scope;
    this.$http = $http;
    this.$location = $location;
    this.productService = productService;
    this.state = stateService.adminProducts;
    this.products = [];
    this.productcategories = [];
    this.$scope.errmsg = '';
    this.search = {};

    this.productColumns = [
      {
        title: '#',
        field: 'code',
      }, {
        title: 'Naam',
        field: 'name'
      }
    ];

    this.productCategoryColumns = [
      {
        title: 'Naam',
        field: 'name'
      }
    ];
  }

  $onInit() {
  	this.productService.getProducts().then(items => {
  		this.products = items;
  	});
  	this.productService.getProductFamilies().then(items => {
  		this.productcategories = items;
    });
    this.search = this.state.search;
  }

  $onDestroy() {
    this.state.search = this.search;
  }

  NewProduct () {
  	this.$location.path('/admin/product/');
  }

  NewGroup () {
  	this.$location.path('/admin/productfamily/');
  }

  openProduct(product) {
    this.$location.path(`/admin/product/${product._id}`);
  }

  openProductFamily(productFamily) {
    this.$location.path(`/admin/productcategory/${productFamily._id}`);
  }

  onRemoveCategory (category) {
    var proceed = confirm("Ben je zeker dat je dit item wilt verwijderen? Dit kan niet ongedaan gemaakt worden.");

    if (proceed) {
    	this.$http.delete('/api/productfamilies/' + category._id)
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

  onRemoveProduct (product) {
    var proceed = confirm("Ben je zeker dat je dit item wilt verwijderen? Dit kan niet ongedaan gemaakt worden.");

    if (proceed) {
    	//product can only be deleted if there are NO references to it, else it needs to be deactivated
      this.$http.delete('/api/products/' + product._id)
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
