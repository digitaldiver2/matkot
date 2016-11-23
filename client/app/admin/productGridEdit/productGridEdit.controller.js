'use strict';
(function(){

class ProductGridEditComponent {
  constructor($q, productService, userService, socket, $scope) {
    this.message = 'Hello';
  	this.productService = productService;
  	this.userService = userService;
  	this.state = 'init';
  	this.errmsg = '';
  	this.$q = $q;
  	this.socket = socket;
    this.reason = 'jaartelling';

    this.searchObject = {active: true};

    this.sortType = 'code';
    this.sortReverse = false;

  	$scope.$on('$destroy', function () {
  		socket.unsyncUpdates('product');
  		socket.unsyncUpdates('usergroup');
  		socket.unsyncUpdates('pricecategory');
  	});
  }

  $onInit() {
  	var productQ = this.productService.getProducts();
  	var productFamilyQ = this.productService.getProductFamilies();
  	var priceCategoryQ = this.productService.getPriceCategories();
  	var userGroupQ = this.userService.getUserGroups();

  	this.$q.all([productQ, productFamilyQ, priceCategoryQ, userGroupQ]).then (answers => {
  		this.products = answers[0];
  		this.productFamilies = answers[1];
  		this.priceCategories = answers[2];
  		this.usergroups = answers[3];

  		for (var i=0; i< this.products.length; i++) {
  			this.addExtraFields(this.products[i], this.usergroups, this.priceCategories);
  		}
  		this.socket.syncUpdates('product', this.products,  (event, item, itemlist) => {
  			var index = this.findWithAttribute(this.products, '_id', item._id);
  			this.addExtraFields(item, this.usergroups, this.priceCategories);
  			if (index >=0) {
  				this.products[index] = item;
  			} else {
  				this.products.push(item);

  			}
  		});
  		this.socket.syncUpdates('priceCategory', this.priceCategories);
  		this.socket.syncUpdates('groups', this.usergroups);

  		this.state = 'ready';
  	}, err => {
  		this.errmsg = err;
  	});
  }

  addExtraFields(product, groups, categories) {
  	product.extra_groups = {};
  	for (var i=0; i<groups.length; i++) {
  		product.extra_groups[groups[i]._id] = this.hasGroup(product, groups[i]);
  	}
  	product.extra_prices = {};
  	for (var i=0; i<categories.length; i++) {
  		product.extra_prices[categories[i]._id] = this.getCategoryPrice(product, categories[i]);
  	}
  }

  hasGroup(product, group) {
  	var result = product.visiblegroups.indexOf(group._id) >= 0;
  	// console.log(result);
  	return result;
  }

  categoryIndex(product, category) {
  	var index = this.findWithAttribute(product.prices, 'pricecategory', category._id);
  	return index;
  }

  getCategoryPrice(product, category) {
  	var index = this.categoryIndex(product, category);
  	if (index >= 0) {
  		return product.prices[index].price;
  	}
  }

  categoryPriceChanged(product, category) {
  	var index = this.categoryIndex(product, category);
  	var newValue = product.extra_prices[category._id];
  	if (index >=0) {
	  	if (newValue < 0) {
	  		//negative value means no specific price for this category
	  		product.prices.splice(index, 1)
	  	} else {
	  		console.dir(product.prices);
	  		console.dir(index);
	  		console.dir(product.prices[index]);
	  		product.prices[index].price = newValue;
	  	}
	} else {
		if (newValue >= 0) {
			product.prices.push({price: newValue, pricecategory: category._id});
		}
	}
  	this.productService.updateProduct(product);
  }

  findWithAttribute(array, attr, value) {
  	for (var i=0; i<array.length; i++) {
  		if (array[i][attr] === value) {
  			return i;
  		}
  	}
  	return -1;
  }

  GroupChanged(product, group) {
  	var index = product.visiblegroups.indexOf(group._id);
  	if (index > -1) {
  		product.visiblegroups.splice(index, 1);
  		console.log('removed group');
  	} else {
  		product.visiblegroups.push(group._id);
  		console.log('added group');
  	}
  	this.productService.updateProduct(product);
  }

}

angular.module('matkotApp.admin')
  .component('productGridEdit', {
    templateUrl: 'app/admin/productGridEdit/productGridEdit.html',
    controller: ProductGridEditComponent
  });

})();
