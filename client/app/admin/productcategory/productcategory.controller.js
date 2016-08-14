'use strict';
(function(){

class ProductcategoryComponent {
  constructor($scope, $http, $stateParams, $location) {
  	this.$scope = $scope;
  	this.$http = $http;
  	this.$location = $location;
  	this.id = $stateParams.id;
  	this.category = {};
  }

  $onInit() {
  	if (this.id) {
  		this.$http.get('/api/productfamilies/' + this.id).then(response=> {
  			this.category = response.data;
  		});

      this.$http.get('/api/products/category/' + this.id).then(response => {
        this.products = response.data;
      });
  	}
  }

  submit () {
  	if (this.id) {
  		//update
  		this.$http.put('/api/productfamilies/' + this.id, this.category);
  	} else {
  		//create new
  		this.$http.post('/api/productfamilies/', this.category);
  	}
  	this.$location.path('/admin/products');
  }
}

angular.module('matkotApp')
  .component('productcategory', {
    templateUrl: 'app/admin/productcategory/productcategory.html',
    controller: ProductcategoryComponent
  });

})();
