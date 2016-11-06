'use strict';
(function(){

class PricecategoryComponent {
  constructor($http, $location, $stateParams, productService) {
  	this.$http = $http;
  	this.$location = $location;
  	this.$stateParams = $stateParams;

    this.productService = productService;

  	this.id = $stateParams.id;

    this.successMsg = '';
    this.errMsg = '';
  }

  $onInit () {
  	if (this.id) {
  		this.productService.getPriceCategory(this.id)
      .then (category => {
  			this.category = category;
  		}, err => {
        this.errMsg = err;
      });
  	}
  }

  submit () {
    this.successMsg = '';
    this.errMsg = '';

  	if (this.id) {
  		this.productService.updatePriceCategory(this.category)
      .then (() => {
        this.successMsg = 'Category opgeslagen'
      })
      .catch (err => {
        this.errMsg = err;
      });
  	} else {
  		this.productService.savePriceCategory(this.category)
      .then (() => {
        this.successMsg = 'Category opgeslagen'
      })
      .catch (err => {  
        this.errMsg = err;
      });
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
