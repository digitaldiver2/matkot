'use strict';
(function(){

class PricecategoryComponent {
  constructor($scope, $http, $location, $stateParams) {
  	this.$scope = $scope;
  	this.$http = $http;
  	this.$location = $location;
  	this.$stateParams = $stateParams;

  	this.id = $stateParams.id;
  	this.$scope.category = {};
  }

  $onInit () {
  	if (this.id) {
  		this.$http.get('/api/pricecategories/' + this.id).then (response => {
  			this.$scope.category = response.data;
  		});
  	}
  }

  submit () {
  	if (this.id) {
  		this.$http.put('/api/pricecategories/' + this.id, this.$scope.category);
  	} else {
  		this.$http.post('/api/pricecategories/', this.$scope.category);
  	}
  	this.$location.path('/admin/pricing');
  }
}

angular.module('matkotApp')
  .component('pricecategory', {
    templateUrl: 'app/admin/pricecategory/pricecategory.html',
    controller: PricecategoryComponent
  });

})();
