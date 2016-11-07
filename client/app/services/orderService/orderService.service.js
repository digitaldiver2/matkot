'use strict';

angular.module('matkotApp.orderService', [])
  .service('orderService', function ($http, $q) {
    // AngularJS will instantiate a singleton by calling "new" on this function
	this.STATE_DRAFT = "DRAFT";
	this.STATE_ORDERED = 'ORDERED';
	this.STATE_APPROVED = 'APPROVED';
	this.STATE_DELIVERED = 'DELIVERED';
	this.STATE_SHORTAGE = 'SHORTAGE';
	this.STATE_CANCELLED = 'CANCELLED';
	this.STATE_CLOSED = 'CLOSED';

    this.getUserOrders = function (user_id) {
    	return $http.get('/api/orders/user/' + user_id)
    		.then(res => {
    			return res.data;
    		})
    		.catch(err => {
    			return $q.reject(err.data);
    		});
    }

    this.getGroupOrders = function (group_id) {
    	return $http.get('/api/orders/group/' + group_id)
    		.then(res => {
    			return res.data;
    		})
    		.catch(err => {
    			return $q.reject(err.data);
    		});
    }

    this.getOrders = function () {
    	return $http.get('/api/orders/user/' + this.user._id)
    		.then(res => {
    			return res.data;
    		})
    		.catch(err => {
    			return $q.reject(err.data);
    		});
    }

    this.isDeletable = function (order) {
    	return order.state == 'DRAFT' && !order.ordernumber;
    }

    this.deleteOrder = function (order) {
    	if (this.isDeletable (order)) {
    		return $http.delete('/api/orders/' + order._id)
    			.then(response => {
    				return "order succesfully deleted";
    			})
    			.catch (err => {
    				return $q.reject(err.data);
    			});
    	} else {
    		return $q.reject("Trying to delete order that's not deletable anymore");
    	} 
    }

    this.copyOrder = function (order, user) {
    	//to implement
    	/*
    	create new order
    	copy group + products

    	empty comments, ordernumber, ...
    	*/
    	var newOrder = {};
    	newOrder.name = 'copy of ' + order.name;
    	newOrder.group = order.group;
    	newOrder.active = true;
    	newOrder.info = order.info;
    	newOrder.state = this.STATE_DRAFT;
    	newOrder.owner = user._id;
    	newOrder.creator = user._id;
    	newOrder.modifier = user._id;
    	newOrder.products = [];

    	//add products
    	order.products.forEach(productitem => {
    		newOrder.products.push({product: productitem.product, ordered: productitem.ordered});
    	});

    	//calculate product category

    	//calculate prices
    }

    this.addCommentToOrder = function (order, comment) {
    	console.log('service: addCommentToOrder');
    	return $http.put('/api/orders/comment/' + order._id, {body: comment})
    		.then(res => {
    			return res.data;	
    		}, err => {
    			return $q.reject(err.data);
    		});
    }

    this.editOrderId = function (order_id) {
    	//open edit page
    }

    this.viewOrderId = function (order_id) {
    	//open view page
    }


  });
