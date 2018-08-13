'use strict';

angular.module('matkotApp.productService', [])
    .service('productService', function ($http, $q, $location) {
        console.log('-------new productService-----------');
        // AngularJS will instantiate a singleton by calling "new" on this function
        this.$q = $q;
        this.products = undefined;
        this.pricecategories = undefined;
        this.productfamilies = undefined;

        this.productIsAvailableForGroup = function (product, group) {
            // if no visible groups are defined, the products are by default available to everyone.
            if (!product.visiblegroups || product.visiblegroups.length === 0)
                return true;

            // if a group is defined, and visible groups is not empty, the product is only available for visible groups
            const id = typeof (group) === 'object' ? group._id : group;
            if (id) {
                for (let i = 0; i < product.visiblegroups.length; i++) {
                    let vid = typeof (product.visiblegroups[i]) === 'object' ? product.visiblegroups[i]._id : product.visiblegroups[i];
                    if (id === vid) {
                        return true
                    }
                }
            }
            // fall through: false
            return false;
        }

        this.getItems =  (url, list) => {
            /* the list is only used to check if the data can be loaded from cache. It seems not possible to 
            pass e.g. this.products and have the products filled in this function. they always seem to be undefined afterwards.*/
            if (list === undefined) {
                console.log(`load ${url}`);
                return $http.get(`${url}`)
                    .then(res => {
                        list = res.data;
                        return list;
                    }, err => {
                        return $q.reject(err.data);
                    });
            } else {
                console.log(`load cached ${url}`);
                const deferred = this.$q.defer();
                const promise = deferred.promise;
                deferred.resolve(list);
                return promise;
            }
        }

        this.saveItem = function (url, item, list) {
            if (item._id)
                delete item._id;

            return $http.post(`${url}`, item)
                .then(res => {
                    this.handleUpdatedItem(res.data, list);
                    return res.data;
                }, err => {
                    $q.reject(data.err);
                });
        }

        this.getProductFamilies = function () {
            return this.getItems('/api/productfamilies', this.productfamilies).then(items => this.productfamilies = items);
        }

        this.getPriceCategories = function () {
            return this.getItems('/api/pricecategories', this.pricecategories).then(items => this.pricecategories = items);
        }

        this.getProducts =  () => {
            return this.getItems('/api/products', this.products, this.testitem).then((products) => {
                this.products = products;
                return products});
        }

        //get all products for specific group
        this.getGroupProducts = function (group_id, price_category_id) {
            return this.getProducts().then(products => {
                let prods = products.filter(product => {
                    return this.productIsAvailableForGroup(product, group_id);
                })
                this.selectCorrectPrice(prods, price_category_id);
                return prods;
            }, err => {
                return $q.reject(err.data);
            });
        }

        //set correct default price of product, depending on price_category
        this.selectCorrectPrice = function (products, price_category_id) {
            for (var i = 0; i < products.length; i++) {
                var product = products[i];
                product.unitprice = product.defaultprice;
                //if product has custom prices and there is a group specified
                if (product.prices.length > 0 && price_category_id != '' && price_category_id != undefined) {
                    for (var j = 0; j < product.prices.length; j++) {
                        if (product.prices[j].pricecategory == price_category_id) {
                            product.unitprice = product.prices[j].price;
                        }
                    }
                }
                products[i] = product;
            }
        }

        this.getItem = function (getItemsFct, id) {
            return getItemsFct() 
                .then(items => {
                    return items.find(item => item._id === id);
                }, err => {
                    return $q.reject(err.data);
                });
        }

        this.getPriceCategory = function (id) {
            return this.getItem(this.getPriceCategories, id);
        }

        this.getProduct = function (id) {
            return this.getItem(this.getProducts, id);
            // return this.getProducts()
            //     .then(products => {
            //         return products.find(product => product._id === id);
            //     }, err => {
            //         return $q.reject(err.data);
            //     });
        }
        
        this.handleUpdatedItem = function (item, list) {
            if (list) {
                const index = list.findIndex(listitem => listitem._id === item._id);
                if (index > -1) {
                    list[index] = item;
                } else {
                    list.push(item);
                }
            }
        }

        this.updateItem = function (url, item, list) {
            return $http.put(`${url}${item._id}`, item)
                .then(res => {
                    this.handleUpdatedItem(res.data, list);
                    return res.data;
                }, err => {
                    return $q.reject(err.data);
                });
        }

        this.updateProduct = function (product) {
            return this.updateItem('/api/products/', product, this.products);
        }

        this.updatePriceCategory = function (priceCategory) {
            return this.updateItem('/api/pricecategories/', priceCategory, this.pricecategories);
        }

        this.saveProduct = function (product) {
            return this.saveItem('/api/products', product, this.products);
        }

        this.savePriceCategory = function (priceCategory) {
            return this.saveItem('/api/pricecategories', priceCategory, this.pricecategories);
        }

        this.changeProductStock = function (product, stock_count, reason) {
            return $http.put('/api/products/stockchange/' + product._id + '/' + stock_count + '/' + reason)
                .then(res => {
                    return res.data;
                }, err => {
                    return $q.reject(err.data);
                });
        }

        this.matchByProductCategory = function (category) {
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

        //sync product.ordered with order.product.ordered
        this.syncProductsWithOrder = function (products, order) {
            for (var i = 0; i < order.products.length; i++) {
                var productitem = order.products[i];
                var shopproduct = _.find(products, { _id: productitem.product._id });
                // TODO: sync other fields too: received, approved, ..
                if (shopproduct) {
                    shopproduct.ordered = productitem.ordered;
                    shopproduct.approved = productitem.approved;
                    shopproduct.received = productitem.received;
                    shopproduct.returned = productitem.returned;
                } else {
                    console.log(`product with id ${productitem.product._id} (${productitem.product.name}) not found'`)
                }
            }
        }

    });
