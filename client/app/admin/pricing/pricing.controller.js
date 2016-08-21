'use strict';
(function(){

class PricingComponent {
  constructor($scope, $http, $location) {
  	this.$scope = $scope;
  	this.$http = $http;
  	this.$location = $location;

  	this.$scope.categories = [];
    this.$scope.errmsg = '';
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
    var proceed = confirm("Ben je zeker dat je dit item wilt verwijderen? Dit kan niet ongedaan gemaakt worden.");

    if (proceed) {
    	this.$http.delete ('/api/pricecategories/' + id)
        .then(response => {
          this.loadCategories();
        })
        .catch(err => {
          this.$scope.errmsg = err.data;
        });
    }
  }
}

angular.module('matkotApp')
  .component('pricing', {
    templateUrl: 'app/admin/pricing/pricing.html',
    controller: PricingComponent
  });

})();
