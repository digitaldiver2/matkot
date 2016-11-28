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

	this.saveOrder = function (order) {
		order.products = order.products.filter(function (product) {
	      return product.ordered > 0;
	    });

	    if (order._id) {
		    return $http.put('/api/orders/' + order._id, order).then(res => {
		    	return;
		    }, err => {
		    	return $q.reject(err.data);
		    });
	    } else {
	    	return $http.post('/api/orders/', order).then(res => {
	    		return;
	    	}, err => {
	    		return $q.reject(err.data);
	    	});
	    }
	}



    this.getUserOrders = function (user_id) {
    	return $http.get('/api/orders/user/' + user_id)
    		.then(res => {
    			return res.data;
    		})
    		.catch(err => {
    			return $q.reject(err.data);
    		});
    }

    this.convertDates = function(order) {
    	order.eventstart = new Date(order.eventstart );
		order.eventstop = new Date(order.eventstop );
		order.pickupdate = new Date(order.pickupdate );
		order.returndate = new Date(order.returndate );
    }

    this.getOrder = function (order_id) {
    	return $http.get('/api/orders/' + order_id)
    		.then(res => {
    			var order = res.data;
    			order.staged_comments = [];
    			this.convertDates(order);
    			return order;
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

    this.stageCommentToOrder = function (order, comment) {
    	order.staged_comments.push(comment);
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

    this.calcProductAvailability = function (order, prod) {
    	//available = stock - shortage_nok - away - leaving
    	//stock = product.stock
    	//shortage_nok = all orders with shortage for this product that is not resolved yet
    	var overlapping =	{
			$or: [
				{//pickupdate between order pickup and order return
				    'pickupdate': {
				    	$gt: order.pickupdate, 
				    	$lt: order.returndate
				    }
				}, 
				{//order pickup between pickup and return
				    'pickupdate': {$lt: order.pickupdate}, 
				    'returndate': {$gt: order.pickupdate}
				},
				{//leaving on same date
					'pickupdate': order.pickupdate
				} 
			], 
			'_id': {$ne: order._id},
			products: { 
				$elemMatch: {product: prod._id}
			},
			state: {$ne: this.STATE_DRAFT, $ne: this.STATE_CANCELLED}
		};

		var overlappingResultFields = {
				state: true,
				code: true,
				name: true,
				products: { $elemMatch: {product: prod._id}},
				group: true,
				owner: true,
				eventstart: true,
				eventstop: true,
				pickupdate: true,
				returndate: true
			};

		var shortages = {
				shortages: {
					$elemMatch: {product: prod._id, resolved: false}
				}
			};

		var shortagesResultFields = {
			state: true,
			code: true,
			name: true,
			shortages: { $elemMatch: {product: prod._id}},
			group: true,
			owner: true,
			eventstart: true,
			eventstop: true,
			pickupdate: true,
			returndate: true
		}

		var shortageQ = $http.post('/api/orders/query/x', {query: shortages, fields: shortagesResultFields});
		var overlappingQ = $http.post('/api/orders/query/x', {query: overlapping, fields: overlappingResultFields});

		return $q.all([shortageQ, overlappingQ]).then(answer => {

			var ordersWithShortage = answer[0].data;
			var overlappingorders = answer[1].data;

			var available = prod.stock;
			var away = 0;
			var short = 0;

			//calc shortages
			var shortorders = [];
			for(var i=0; i< ordersWithShortage.length; i++) {
				var order = ordersWithShortage[i];
				for (var j=0; j < order.shortages.length; j++) {
					var shortage = order.shortages[j];
					if (shortage.product == prod._id && shortage.qty_short > shortage.qty_ok) {
						available -= shortage.qty_short - shortage.qty_ok;
						shortorders.push(order);
						short += shortage.qty_short - shortage.qty_ok;
					}
				}
			}

			//calc overlapping
			for (var i=0; i<overlappingorders.length; i++) {
				var order = overlappingorders[i];
				for(var j=0; j<order.products.length; j++) {
					var productitem = order.products[j];
					if (productitem.product == prod._id) {
						if (order.state == this.STATE_APPROVED) {
							available -= productitem.approved;
							away += productitem.approved;
						} else if (order.state == this.STATE_DELIVERED) {
							available -= productitem.received;
							away += productitem.received;
						}

					}
				}
			}
			prod.available = available;
			prod.shortOrders = shortorders;
			prod.overlappingorders = overlappingorders;
			prod.away = away;
			prod.short = short;
			return available;
		}, err => {
    			return $q.reject(err.data);
		});
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
    		if (item.resolved == false) {
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

    //update product in order (only in draft mode)
    this.updateOrderProduct = function (order, product) {
	    var index = -1;
	    var productitem = null;

	    for (var i=0; i<order.products.length; i++) {
	      productitem = order.products[i];
	      if (productitem.product._id == product._id) {
	        index = i;

	        break;
	      }
	    }

	    if (product.ordered != 0) {
	      if (index != -1) {
	        productitem.ordered = product.ordered;
	      } else {
	        //add item

	        order.products.push({
	          'product': product,
	          'ordered': product.ordered,
	          'unitprice': product.unitprice,
	          'approved': 0,
	          'received': 0,
	          'returned': 0  
	        });
	      }
	    } else {
	      if (index != -1) {
	        //remove item
	        order.products.splice(index, 1);
	      } 
	        // else impossible state, but do nothing
	    }

	    this.saveOrder(order);
	  }

  });
