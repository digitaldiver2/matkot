'use strict';
(function(){

class ProductComponent {
  constructor($scope, $http, $stateParams, $location) {
    this.$scope = $scope;
    this.$http = $http;
    this.id = $stateParams.id;
    this.$scope.product = {};
    this.$scope.groups = [];
    this.$scope.productcategories = [];
  }

  $onInit() {
  	this.$http.get('/api/productfamilies').then(response => {
  		this.$scope.productcategories = response.data;
  	});

  	this.$http.get('/api/usergroups').then(response => {
  		this.$scope.groups = response.data;
  	});
  }

  submit() {
  	if (this.id) {
		//update
		this.$scope.put('/api/product/' + this.id, this.$scope.product);
  	} else {
  		//new product
		this.$scope.post('/api/product/', this.$scope.product);
  	}
  	this.$location.path ('/admin/products');
  }
}

angular.module('matkotApp')
  .component('product', {
    templateUrl: 'app/admin/product/product.html',
    controller: ProductComponent
  });

})();
