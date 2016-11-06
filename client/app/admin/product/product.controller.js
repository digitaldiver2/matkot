'use strict';
(function(){

class ProductComponent {
  constructor($scope, $http, $stateParams, $location, productService, userService) {
    this.$location = $location;
    this.id = $stateParams.id;
    this.product = {};
    this.groups = undefined;
    this.productcategories = undefined;
    this.pricecategories = undefined;
    this.loaded = {};
    this.errmsg = '';
    this.productService = productService;
    this.userService = userService;
  }

  $onInit() {
    this.refresh();
  }

  refresh () {
    if (this.id) {
      this.productService.getProduct(this.id).then(product => {
        this.product = product;
        this.loaded['product'] = true;
      });
    }

    this.productService.getProductFamilies().then(productfamilies => {
      this.productcategories = productfamilies;
      this.loaded['productfamilies'] = true;
      this.helpsync();
    });

    this.userService.getUserGroups().then(usergroups => {
      this.groups = usergroups;
      this.loaded['usergroups'] = true;
      this.helpsync();
    });

    this.productService.getPriceCategories().then(categories => {
      this.pricecategories = categories;
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
    if (!category.hasprice) {
      category.price = this.product.defaultprice;
    }
  }

  updateStock(stock_cnt, reason) {
    this.errMsg = '';
    this.productService.changeProductStock(this.product, stock_cnt, reason)
      .then (product => {
        this.refresh();
      })
      .catch(err => {
        this.errMsg = err;
      });
  }

  submit() {
    this.updategroups();
    this.updateproductfamilies();
    this.updatepricecategories();

  	if (this.id) {
  		//update
  		this.productService.updateProduct(this.product)
        .then(product => {
          this.$location.path ('/admin/products');
        })
        .catch(err => {
          this.errMsg = err;
        });
    } else {
      //new product
      this.productService.saveProduct(this.product)
        .then(product => {
          this.$location.path('/admin/products');
        })
        .catch(err => {
          this.errMsg = err;
        })
    }
  }

  setgroups() {
    for (var i=0; i<this.product.visiblegroups.length; i++) {
      for (var j=0; j<this.groups.length; j++) {
        if (this.product.visiblegroups[i] == this.groups[j]._id) {
          this.groups[j].checked = true;
          break;
        }
      }
    }
  }

  setproductfamilies() {
    for (var i=0; i<this.product.productfamily.length; i++) {
      for (var j=0; j<this.productcategories.length; j++) {
        if (this.product.productfamily[i] == this.productcategories[j]._id) {
          this.productcategories[j].checked = true;
          break;
        }
      }
    }
  }

  setpriceCategories() {
    //run over all pricecategories
    for (var j=0; j<this.pricecategories.length; j++) {
      //find categorie in product prices
      this.pricecategories[j].hasprice = false;
      this.pricecategories[j].price = this.product.defaultprice;

      for (var i=0; i<this.product.prices.length; i++) {
        if (this.product.prices[i].pricecategory == this.pricecategories[j]._id) {
          this.pricecategories[j].price = this.product.prices[i].price;
          this.pricecategories[j].hasprice = true;
          break;
        }
      }
    }
  }

  updategroups() {
    this.product.visiblegroups = [];
    for (var j=0; j<this.groups.length; j++) {
      if (this.groups[j].checked) {
        this.product.visiblegroups.push(this.groups[j]._id);
      }
    }
  }

  updateproductfamilies() {
    this.product.productfamily = [];
    for (var j=0; j<this.productcategories.length; j++) {
      if (this.productcategories[j].checked) {
        this.product.productfamily.push(this.productcategories[j]._id);
      }
    }
  }

  updatepricecategories() {
    this.product.prices = [];
    for (var j=0; j<this.pricecategories.length; j++) {
      if (this.pricecategories[j].hasprice) {
        this.product.prices.push(
          {
            price: this.pricecategories[j].price,
            pricecategory: this.pricecategories[j]._id
          }
        );
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
