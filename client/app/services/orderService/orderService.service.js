'use strict';

angular.module('matkotApp.orderService', [])
  .service('orderService', function ($http, $q) {
    // AngularJS will instantiate a singleton by calling "new" on this function
	this.STATE_DRAFT = "DRAFT";
	this.STATE_ORDERED = 'ORDERED';
	this.STATE_APPROVED = 'APPROVED';
	this.STATE_DELIVERED = 'DELIVERED';
	this.STATE_OPEN = 'OPEN';
	this.STATE_CLOSED = 'CLOSED';
	this.STATE_CANCELLED = 'CANCELLED';
	this.STATE_REOPENED = 'REOPENED';

    this.getUserOrders = function (user_id) {
    	return $http.get('/api/orders/user/' + user_id)
    		.then(res => {
    			return res.data;
    		})
    		.catch(err => {
    			return $q.reject(err.data);
    		});
    }

    this.getOrder = function (order_id) {
    	return $http.get('/api/orders/' + order_id)
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


    this.reOpen = function (order) {
    	order.state = this.STATE_REOPENED;
    	order.shortages = [];
    	//TODO log reopening

    }

    //calculate shortages
    //TODO: calculate consumables
    this.evaluateOrder = function (order) {
    	//not in open or closed state => never evaluated before
    	if (order.state != this.STATE_OPEN && order.state != this.STATE_CLOSED) {
	    	order.products.forEach(productItem => {
	    		var shortage = productItem.received - productItem.returned;
	    		var shortage_item = undefined;
	    		//check if product is in shortages (in case the order was reopened)
	    		for(var i=0; i< order.shortages.length; i++) {
	    			var item = order.shortages[i];
    				if (item.product._id == productItem.product._id) {
    					shortage_item = item;
    					break;
    				}
	    		}

	    		if (shortage_item != undefined) {
	    			//update qty_short if already in list
	    			shortage_item.qty_short = shortage;
	    		} else if (shortage > 0) {
	    			order.shortages.push({
	    				product: productItem.product,
	    				qty_short: shortage,
	    				qty_ok: 0
	    			});
	    		}
	    	});
	    } 
    	//check if shortages are fixed
    	var can_close = true;
    	for(var i=0; i<order.shortages.length; i++) {
    		var item = order.shortages[i];
    		var shortage = item.qty_short - item.qty_ok;
    		if (shortage > 0) {
    			can_close = false;
    			break;
    		}
    	}

    	if (can_close) {
    		order.state = this.STATE_CLOSED;
    	} else {
    		order.state = this.STATE_OPEN;
    	}
    }

    this.orderIsEvaluated = function (order) {
    	return order!= undefined && (order.state == this.STATE_OPEN || order.state == this.STATE_CLOSED);
    }

    this.orderIsClosed = function (order) {
    	return order.state == this.STATE_CLOSED;
    }

    this.orderIsDraft = function (order) {
    	//if order is not defined, return false

    	return order == undefined || order.state == this.STATE_DRAFT;
    }


  });
