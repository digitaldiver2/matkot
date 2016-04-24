'use strict';
(function(){

class PricingComponent {
  constructor($scope, $http, $location) {
  	this.$scope = $scope;
  	this.$http = $http;
  	this.$location = $location;

  	this.$scope.categories = [];
  }

  $onInit() {
  	this.loadCategories();
  }

  loadCategories () {
  	this.$http.get('/api/pricecategories').then (response => {
  		this.$scope.categories = response.data;
  	});
  }

  NewCategory() {
  	this.$location.path('/admin/pricecategory/');
  }

  DeleteCategory(id) {
  	this.$http.delete ('/api/pricecategories/' + id);
  	this.loadCategories();
  }
}

angular.module('matkotApp')
  .component('pricing', {
    templateUrl: 'app/admin/pricing/pricing.html',
    controller: PricingComponent
  });

})();
