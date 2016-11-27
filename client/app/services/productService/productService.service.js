'use strict';

angular.module('matkotApp.productService', [])
  .service('productService', function ($http, $q, $location) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    this.getProductFamilies = function () {
    	return $http.get('/api/productfamilies')
    		.then(res => {
    			return res.data;
    		}, err => {
    			return $q.reject(err.data);
    		});
    }

    this.getProducts = function () {
    	return $http.get('/api/products')
    		.then(res => {
    			return res.data;
    		}, err => {
    			return $q.reject(err.data);
    		});
    }

    //get all products for specific group
    this.getGroupProducts = function (group_id, price_category_id) {
        return $http.get('/api/products/group/' + group_id)
            .then(res => {
                this.selectCorrectPrice(res.data, price_category_id);
                return res.data;
            }, err => {
                return $q.reject(err.data);
            });
    }

    //set correct default price of product, depending on price_category
    this.selectCorrectPrice = function (products, price_category_id) {
        for (var i=0; i< products.length; i++) {
            var product = products[i];
            product.unitprice = product.defaultprice;
            //if product has custom prices and there is a group specified
            if (product.prices.length > 0 && price_category_id != '' && price_category_id != undefined) {
                for (var j=0; j<product.prices.length; j++) {
                    if (product.prices[j].pricecategory == price_category_id) {
                        product.unitprice = product.prices[j].price;
                    }
                }
            }
            products[i] = product;
        }
      }


    this.getProduct = function (id) {
    	return $http.get('/api/products/' + id)
    		.then(res => {
    			return res.data;
    		}, err => {
    			return $q.reject(err.data);
    		});
    }

    this.updateProduct = function (product) {
    	return $http.put('/api/products/' + product._id, product)
    		.then(res => {
    			return res.data;	
    		}, err => {
    			return $q.reject(err.data);
    		});
    }

    this.saveProduct = function (product) {
    	if (product._id) 
    		delete product._id;

    	return $http.post('/api/products/', product)
    		.then(res => {
    			return res.data;
    		}, err => {
    			$q.reject(data.err);
    		});
    }

    this.viewProduct = function (id) {

    }

    this.editProduct = function (id) {

    }

    this.changeProductStock = function (product, stock_count, reason) {
    	return $http.put('/api/products/stockchange/' + product._id + '/' + stock_count + '/' + reason)
    		.then(res => {
    			return res.data;
    		}, err => {
    			return $q.reject(err.data);
    		});
    }

    this.getPriceCategories = function () {
    	return $http.get('/api/pricecategories')
    		.then(res => {
    			return res.data;
    		}, err => {
    			return $q.reject(err.data);
    		});
    }

    this.getPriceCategory = function (id) {
    	return $http.get('/api/pricecategories/' + id)
    		.then(res => {
    			return res.data;
    		}, err => {
    			return $q.reject(err.data);
    		});
    }

    this.updatePriceCategory = function (priceCategory) {
    	return $http.put('/api/pricecategories/' + priceCategory._id, priceCategory)
    		.then(res => {
    			return 'OK';	
    		}, err => {
    			return $q.reject(err.data);
    		});
    }

    this.savePriceCategory = function (priceCategory) {
    	if (priceCategory._id) 
    		delete priceCategory._id;

    	return $http.post('/api/pricecategories/', priceCategory)
    		.then(res => {
    			return 'OK';
    		}, err => {
    			$q.reject(data.err);
    		});
    }

  });
