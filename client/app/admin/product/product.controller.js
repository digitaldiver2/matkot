'use strict';
(function(){

class ProductComponent {
  constructor($scope, $http, $stateParams, $location) {
    this.$scope = $scope;
    this.$http = $http;
    this.$location = $location;
    this.id = $stateParams.id;
    this.$scope.product = {};
    this.$scope.groups = undefined;
    this.$scope.productcategories = undefined;
    this.$scope.pricecategories = undefined;
    this.loaded = {};
  }

  $onInit() {
    if (this.id) {
      this.$http.get('/api/products/' + this.id).then(response => {
        this.$scope.product = response.data;
        this.loaded['product'] = true;
        console.log('product:');
        console.dir(this.$scope.product);
      });
    }

  	this.$http.get('/api/productfamilies').then(response => {
  		this.$scope.productcategories = response.data;
      this.loaded['productfamilies'] = true;
      this.helpsync();
  	});

  	this.$http.get('/api/usergroups').then(response => {
  		this.$scope.groups = response.data;
      this.loaded['usergroups'] = true;
      this.helpsync();
  	});

    this.$http.get('/api/pricecategories').then(response => {
      this.$scope.pricecategories = response.data;
      this.loaded['pricecategories'] = true;
      this.helpsync();
    });
  }

  helpsync () {
    if (this.loaded['product']) {
      if (this.loaded['productfamilies']) {
        this.setproductfamilies();
      }

      if (this.loaded['usergroups']) {
        this.setgroups();
      }

      if (this.loaded['pricecategories']) {
        this.setpriceCategories();
      }
    }
  }

  todefaultprice (category) {
    console.log('todefaultprice');
    console.log(category.hasprice);
    if (!category.hasprice) {
      category.price = $scope.product.defaultprice;
    }
  }

  submit() {
    this.updategroups();
    this.updateproductfamilies();
    this.updatepricecategories();
    console.log('---send product---');
    console.dir(this.$scope.product);

  	if (this.id) {
  		//update
  		this.$http.put('/api/products/' + this.id, this.$scope.product);
  	} else {
  		//new product
		  this.$http.post('/api/products/', this.$scope.product);
  	}
  	this.$location.path ('/admin/products');
  }

  setgroups() {
    for (var i=0; i<this.$scope.product.visiblegroups.length; i++) {
      for (var j=0; j<this.$scope.groups.length; j++) {
        if (this.$scope.product.visiblegroups[i] == this.$scope.groups[j]._id) {
          this.$scope.groups[j].checked = true;
          break;
        }
      }
    }
  }

  setproductfamilies() {
    for (var i=0; i<this.$scope.product.productfamily.length; i++) {
      for (var j=0; j<this.$scope.productcategories.length; j++) {
        if (this.$scope.product.productfamily[i] == this.$scope.productcategories[j]._id) {
          this.$scope.productcategories[j].checked = true;
          break;
        }
      }
    }
  }

  setpriceCategories() {
    //run over all pricecategories
    for (var j=0; j<this.$scope.pricecategories.length; j++) {
      //find categorie in product prices
      this.$scope.pricecategories[j].hasprice = false;
      this.$scope.pricecategories[j].price = this.$scope.product.defaultprice;
      for (var i=0; i<this.$scope.product.prices.length; i++) {
        if (this.$scope.product.prices[i].pricecategory == this.$scope.pricecategories[j]._id) {
          this.$scope.pricecategories[j].price = this.$scope.product.prices[i].price;
          this.$scope.pricecategories[j].hasprice = true;
          break;
        }
      }
    }
  }

  updategroups() {
    this.$scope.product.visiblegroups = [];
    for (var j=0; j<this.$scope.groups.length; j++) {
      console.dir(this.$scope.groups[j]);
      if (this.$scope.groups[j].checked) {
        this.$scope.product.visiblegroups.push(this.$scope.groups[j]._id);
      }
    }
  }

  updateproductfamilies() {
    this.$scope.product.productfamily = [];
    for (var j=0; j<this.$scope.productcategories.length; j++) {
      if (this.$scope.productcategories[j].checked) {
        this.$scope.product.productfamily.push(this.$scope.productcategories[j]._id);
      }
    }
  }

  updatepricecategories() {
    this.$scope.product.prices = [];
    for (var j=0; j<this.$scope.pricecategories.length; j++) {
      if (this.$scope.pricecategories[j].hasprice) {
        this.$scope.product.prices.push({
          price: this.$scope.pricecategories[j].price,
          pricecategory: this.$scope.pricecategories[j]._id
        });
      }
    }
  }
}

angular.module('matkotApp')
  .component('product', {
    templateUrl: 'app/admin/product/product.html',
    controller: ProductComponent
  });

})();
