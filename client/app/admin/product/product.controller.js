'use strict';
(function () {

  class ProductComponent {
    constructor($scope, $http, $stateParams, $location, productService, userService, orderService) {
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
      this.orderService = orderService;

      this.visibleGroupsColumns = [
        {
          title: 'Naam',
          field: 'name'
        }, {
          title: 'Categorie',
          field: 'pricecategory.name'
        }
      ];
      this.productFamilyColumns = [
        {
          title: 'Naam',
          field: 'name'
        }
      ]
    }

    $onInit() {
      this.refresh();
    }

    onAddVisibleGroup(item) {
      if (!this.product.visiblegroups.find(x => x._id === item._id))
        this.product.visiblegroups.push(item);
    }

    onRemoveVisibleGroup(item) {
      this.product.visiblegroups = this.product.visiblegroups.filter(x => x._id !== item._id);
    }

    onAddProductFamily(item) {
      if (!this.product.productfamily.find(x => x._id === item._id))
        this.product.productfamily.push(item);
    }

    onRemoveProductFamily(item) {
      this.product.productfamily = this.product.productfamily.filter(x => x._id !== item._id);
    }

    refresh() {
      if (this.id) {
        // get orders so they are in cache
        this.orderService.getOrders().then((orders) => {
          this.productService.getProduct(this.id).then(product => {
            this.product = product;
            this.product.orders = orders.filter(order => this.orderService.orderContainsProduct(order, product));
            console.dir(this.product);
            this.loaded['product'] = true;
            this.helpsync();
          });
        });
      }

      this.productService.getProductFamilies().then(productfamilies => {
        this.productcategories = productfamilies;
      });

      this.userService.getUserGroups().then(usergroups => {
        this.groups = usergroups;
      });

      this.productService.getPriceCategories().then(categories => {
        this.pricecategories = categories;
        this.loaded['pricecategories'] = true;
        this.helpsync();
      });
    }

    helpsync() {
      console.log('helpsync')
      if (this.loaded['product']) {
        if (this.loaded['pricecategories']) {
          this.setpriceCategories();
        }
      }
    }

    todefaultprice(category) {
      if (!category.hasprice) {
        category.price = this.product.defaultprice;
      }
    }

    updateStock(stock_cnt, reason) {
      this.errMsg = '';
      this.productService.changeProductStock(this.product, stock_cnt, reason)
        .then(product => {
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
            this.$location.path('/admin/products');
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

    setpriceCategories() {
      //run over all pricecategories
      for (var j = 0; j < this.pricecategories.length; j++) {
        //find categorie in product prices
        this.pricecategories[j].hasprice = false;
        this.pricecategories[j].price = this.product.defaultprice;

        for (var i = 0; i < this.product.prices.length; i++) {
          if (this.product.prices[i].pricecategory == this.pricecategories[j]._id) {
            this.pricecategories[j].price = this.product.prices[i].price;
            this.pricecategories[j].hasprice = true;
            break;
          }
        }
      }
    }

    updatepricecategories() {
      this.product.prices = [];
      for (var j = 0; j < this.pricecategories.length; j++) {
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

  angular.module('matkotApp.admin')
    .component('product', {
      templateUrl: 'app/admin/product/product.html',
      controller: ProductComponent
    });

})();
