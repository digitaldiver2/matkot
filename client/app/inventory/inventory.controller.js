'use strict';
(function(){

class InventoryComponent {
  constructor($scope, $http) {
    this.$scope = $scope;
    this.$http = $http;
    this.products = undefined;
    this.productcategories = undefined;
  }

  $onInit () {
  	this.$http.get('/api/products').then(response => {
  		this.products = response.data;
  	});

  	this.$http.get('/api/productfamilies').then(response => {
  		this.productcategories = response.data;
  		//set all as default option
  		var allesID = this.productcategories.push({name:"Alles2", _id:0}) - 1;
  		this.$scope.categoryFilter = this.productcategories[allesID];
  	});
  }

  matchByGroup = function (category) {
  	return function (product) {
  		if (category == undefined) {
  			return false;
  		}
  		if (category._id == 0) {//all
  			return true;
  		} else {
  			return product.productfamily.indexOf(category._id) > -1;
  		}
  	}
  }
}

angular.module('matkotApp')
  .component('inventory', {
    templateUrl: 'app/inventory/inventory.html',
    controller: InventoryComponent
  });

})();
