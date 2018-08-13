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
		this.STATES = ['DRAFT', 'ORDERED', 'APPROVED', 'DELIVERED', 'OPEN', 'CLOSED', 'CANCELLED', 'REOPENED'];

		// get orders should always collect all the orders the current user has permissions for
		this.orders = undefined;
		this.$q = $q;
		this.$http = $http;

		this.saveOrder = function (order) {
			// new order with only info has no products yet
			if (order.products) {
				// clean up empty product items
				order.products = order.products.filter(product => {
					return this.OrderProductUsed(product);
				});
			}	

			if (order._id) {
				return $http.put('/api/orders/' + order._id, order).then(res => {
					this.handle_updated_order(res.data);
					return res.data;
				}, err => {
					return $q.reject(err.data);
				});
			} else {
				return $http.post('/api/orders/', order).then(res => {
					this.handle_updated_order(res.data);
					return res.data;
				}, err => {
					return $q.reject(err.data);
				});
			}
		}

		this.requestOrder = function (order) {
			order.products = order.products.filter(product => {
				return this.OrderProductUsed(product);
			});
			if (order._id) {
				return $http.put('/api/orders/request/' + order._id, order).then(res => {
					this.handle_updated_order(res.data);
				}, err => {
					return $q.reject(err.data);
				});
			} else {
				// save first and get id
				alert('Gelieve eerst uw aanvraag op te slaan');
				return $q.reject(err.data);
			}
		}

		this.handle_updated_order = function (order) {
			// called when order was saved and the saved version was sent as response.
			// it will update the order in the order list or add it if not yet existing
			if (this.orders) {
				const index = this.orders.findIndex(_order => _order._id === order._id);
				if (index > -1) {
					this.orders[index] = order;
				} else {
					this.orders.push(order);
				}
			}
		}

		this.approveOrder = function (order) {
			if (order._id) {
				return $http.put('/api/orders/approve/' + order._id, order).then(res => {
					this.handle_updated_order(res.data);
				}, err => {
					return $q.reject(err.data);
				});
			} else {
				// save first and get id
				alert('Gelieve eerst uw aanvraag op te slaan');
				return $q.reject(err.data);
			}
		}

		this.convertDates = function (order) {
			order.eventstart = new Date(order.eventstart);
			order.eventstop = new Date(order.eventstop);
			order.pickupdate = new Date(order.pickupdate);
			order.returndate = new Date(order.returndate);
		}

		this.calcUnResolvedShortages = function (order) {
			var count = 0;
			order.unresolved_shortages = order.shortages ? order.shortages.filter(function (obj) { return !obj.resolved }).length : [];
		}

		this.OrderProductUsed = function (product) {
			return product.ordered || product.approved || product.received || product.returned;
		}

		this.getOrders = function () {
			// the serverside is responsibly for only giving the permitted orders to the website
			if (this.orders === undefined) {
				console.log('load orders from db');
				return $http.get('/api/orders/')
					.then(res => {
						this.orders = res.data;
						return this.orders;
					})
					.catch(err => {
						console.error(err);
						return $q.reject(err.data);
					});
			} else {
				const deferred = this.$q.defer();
				deferred.resolve(this.orders);
				return deferred.promise;
			}
		}

		this.getOrder = function (order_id) {
			return this.getOrders().then(orders => {
				const order = orders.find(_order => _order._id === order_id);
				if (order) {
						// don't set presets for empty dates, but force the user to fill them in
				        if (order.eventstart != undefined)
							order.eventstart = new Date(order.eventstart );
				        if (order.eventstop != undefined)
				        	order.eventstop = new Date(order.eventstop );
				        if (order.pickupdate != undefined)
				        	order.pickupdate = new Date(order.pickupdate );
				        if (order.returndate != undefined)
				        	order.returndate = new Date(order.returndate );

					this.calcUnResolvedShortages(order);
				}
				return order;
			});

			// return $http.get('/api/orders/' + order_id)
			// 	.then(res => {
			// 		var order = res.data;
			// 		order.staged_comments = [];
			// 		this.convertDates(order);
			// 		this.calcUnResolvedShortages(order);
			// 		console.dir(order);
			// 		return order;
			// 	})
			// 	.catch(err => {
			// 		return $q.reject(err.data);
			// 	});
		}


		// get user orders by promise
		this.getUserOrders = function (user) {
			const id = typeof(user) === 'object'? user._id: user;
			// get orders where owner == user
			return this.getOrders().then(orders => {
				return orders.filter(order => {
					return order.owner == id || (typeof(order.owner) === 'object' && order.owner._id === id);
				});
			});
		}

		this.getGroupOrders = function (group) {
			const id = typeof(group) === 'object'? group._id: group;
			// get orders where group == group_id 
			return this.getOrders().then(orders => {
				return orders.filter(order => {
					return order.group && (order.group == id || (typeof(order.group) === 'object' && order.group._id === id));
				});
			});
		}

		this.isDeletable = function (order) {
			return order.state == 'DRAFT' && !order.ordernumber;
		}

		this.deleteOrder = function (order) {
			if (this.isDeletable(order)) {
				return $http.delete('/api/orders/' + order._id)
					.then(response => {
						return "order succesfully deleted";
					})
					.catch(err => {
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
				newOrder.products.push({ product: productitem.product, ordered: productitem.ordered });
			});

			//calculate product category

			//calculate prices
		}

		this.addCommentToOrder = function (order, comment) {
			return $http.put('/api/orders/comment/' + order._id, { body: comment })
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

		this._ordersTimeOverlap = function(a, b) {
			// pickupdate A between pickupdate b and returndate b
			// returndate A between pickupdate b and returndate b
			// pickupdate A === pickupdate B
			// ignore same orders
			if (a._id === b._id)
				//comparing with itself should not match, as this will never be useful
				return false;
			return this.orderInPeriod(a, b.pickupdate, b.returndate);
		}

		this.orderInPeriod = function (order, start, end) {
			//returns if an order is away during the period. The order pickup and return don't need to be both in the period.
			// The order can also contain the period.
			return order.pickupdate && order.returndate && order.pickupdate !== undefined && order.returndate !== undefined && 
				order.pickupdate !== null && order.returndate !== null && (
				moment(order.pickupdate).isBetween(start, end, 'day', '[]') || moment(order.returndate).isBetween(start, end, 'day', '[]') ||
				(moment(start).isBetween(order.pickupdate, order.returndate, 'day', '[]') && moment(end).isBetween(order.pickupdate, order.returndate, 'day', '[]')) ||
				moment(order.pickupdate).isSame(start, 'day') || moment(order.returndate).isSame(end, 'day'));
		}
		
		this.orderOverlappingItems = function (a, b) {
			// return all products that a and b have in common
			return b.products.filter(b_item => {
				return a.products.find(a_item => a_item.product._id === b_item.product._id) !== undefined;
			});
		}

		this.getOverlappingOrders = function (order) {
			// search the overlapping orders of order in the cached orders
			return this.getOrders().then(orders => {
				return orders.filter(_order => 
					order.state !== this.STATE_DRAFT && order.state !== this.STATE_CANCELLED &&this._ordersTimeOverlap(order, _order));
			});
		}

		this.calcProductAvailability = function (order, prod) {
			//available = stock - shortage_nok - away - leaving
			//stock = product.stock
			//shortage_nok = all orders with shortage for this product that is not resolved yet
			var overlapping = {
				$or: [
					{//pickupdate between order pickup and order return
						'pickupdate': {
							$gt: order.pickupdate,
							$lt: order.returndate
						}
					},
					{//order pickup between pickup and return
						'pickupdate': { $lt: order.pickupdate },
						'returndate': { $gt: order.pickupdate }
					},
					{//leaving on same date
						'pickupdate': order.pickupdate
					}
				],
				'_id': { $ne: order._id },
				products: {
					$elemMatch: { product: prod._id }
				},
				state: { $ne: this.STATE_DRAFT, $ne: this.STATE_CANCELLED }
			};

			var overlappingResultFields = {
				state: true,
				code: true,
				name: true,
				// products: { $elemMatch: {product: prod._id}},
				products: true,
				group: true,
				owner: true,
				eventstart: true,
				eventstop: true,
				pickupdate: true,
				returndate: true
			};

			var shortages = {
				shortages: {
					$elemMatch: { product: prod._id, resolved: false }
				}
			};

			var shortagesResultFields = {
				state: true,
				code: true,
				name: true,
				// shortages: { $elemMatch: {product: prod._id}},
				shortages: true,
				group: true,
				owner: true,
				eventstart: true,
				eventstop: true,
				pickupdate: true,
				returndate: true
			}

			var shortageQ = $http.post('/api/orders/query/x', { query: shortages, fields: shortagesResultFields });
			var overlappingQ = $http.post('/api/orders/query/x', { query: overlapping, fields: overlappingResultFields });

			return $q.all([shortageQ, overlappingQ]).then(answer => {

				var ordersWithShortage = answer[0].data;
				var overlappingorders = answer[1].data;

				var available = prod.stock;
				var away = 0;
				var short = 0;

				//calc shortages
				var shortorders = [];
				for (var i = 0; i < ordersWithShortage.length; i++) {
					var order = ordersWithShortage[i];
					for (var j = 0; j < order.shortages.length; j++) {
						var shortage = order.shortages[j];
						if (shortage.product == prod._id && shortage.qty_short > shortage.qty_ok) {
							available -= shortage.qty_short - shortage.qty_ok;
							shortorders.push(order);
							short += shortage.qty_short - shortage.qty_ok;
						}
					}
				}

				//calc overlapping
				for (var i = 0; i < overlappingorders.length; i++) {
					var order = overlappingorders[i];
					for (var j = 0; j < order.products.length; j++) {
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
					//skip consumables
					if (!productItem.isconsumable) {
						var shortage = productItem.received - productItem.returned;
						//check if product is in shortages (in case the order was reopened)
						var shortage_item = _.find(order.shortages, (item) => {
							return item.product._id === productItem.product._id;
						});

						if (shortage_item) {
							//update qty_short if already in list
							shortage_item.qty_short = shortage;
						} else if (shortage > 0) {
							order.shortages.push({
								product: productItem.product,
								qty_short: shortage,
								qty_ok: 0
							});
						}
					}
				});
			}
			//check if shortages are fixed
			var can_close = true;
			for (var i = 0; i < order.shortages.length; i++) {
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
			return order != undefined && (order.state == this.STATE_OPEN || order.state == this.STATE_CLOSED);
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
			var productitem = _.find(order.products, (item) => {
				return item.product._id === product._id;
			});

			if (productitem) {
				console.log('update');
				productitem.ordered = product.ordered;
				productitem.approved = product.approved;
				productitem.received = product.received;
				productitem.returned = product.returned;
				productitem.unitprice = product.unitprice;
				// TODO: remove item when all is zero (except unitprice)
			} else {
				console.log('push');
				order.products.push({
					'product': product,
					'ordered': product.ordered ? product.ordered : 0,
					'unitprice': product.unitprice,
					'approved': product.approved ? product.approved : 0,
					'received': product.received ? product.received : 0,
					'returned': product.returned ? product.returned : 0
				});
			}
		}

		this.isMinimumState = function (order, state) {
			const currIndex = this.STATES.indexOf(order.state);
			const refIndex = this.STATES.indexOf(state)
			return currIndex >= refIndex;
		}

		this.orderToPDF = function (order, orderBySKU = true) {
			const now = moment().format('YYYY-MM-DD');
			const pickupDate = moment(order.pickupdate).format('YYYY-MM-DD');
			const returnDate = moment(order.returndate).format('YYYY-MM-DD');

			const headerString = `${order.ordernumber ? order.ordernumber + ' - ' : ''}${order.name} - \
${order.owner.name} - ${order.group ? order.group.name + ' - ' : ''}${pickupDate} - ${returnDate}`;

			//prepare list of products
			const productTable = [
				[
					{ text: 'SKU', style: 'tableHeader' },
					{ text: 'Product', style: 'tableHeader' },
					{ text: 'Gevr.', style: 'tableHeader' },
					{ text: 'Goedgek.', style: 'tableHeader' },
					{ text: 'Ontv.', style: 'tableHeader' },
					{ text: 'Terug', style: 'tableHeader' },
				]
			];

			var orderedProductList = order.products.sort(orderBySKU ? this.sortProductsBySKU : this.sortProductsByName);

			for (var i = 0; i < orderedProductList.length; i++) {
				var product = orderedProductList[i];
				productTable.push([
					product.product.code,
					product.product.name,
					product.ordered,
					this.isMinimumState(order, this.STATE_APPROVED) ? product.approved : '',
					this.isMinimumState(order, this.STATE_DELIVERED) ? product.received : '',
					this.isMinimumState(order, this.STATE_CLOSED) ? product.returned : '']);
			}

			// create the content
			var docDefinition = {
				header: {
					text: headerString,
					margin: [5, 5],
					alignment: 'center'
				},
				footer: function (currentPage, pageCount) {
					return {
						columns: [
							{
								text: `${currentPage.toString()} / ${pageCount}`,
								// alignment: 'center'
								alignment: 'left',
								margin: [10, 10]
							},
							{
								text: now,
								alignment: 'right',
								margin: [10, 10]
							}
						]
					}
				},
				content: [
					{
						text: `${order.ordernumber? order.ordernumber + ' - ': ''}${order.name}`, style: 'header'
					},
					{
						text: 'Info', style: 'subheader'
					},
					{
						columns: [
							{
								text: [
									{ text: `Verantwoordelijke: `, bold: true},
									`${order.owner.name}\r\n`,
									{ text: `Vereniging: `, bold: true},
									`${order.group? order.group.name: ''}\r\n`,
								]
							}
						]
					},
					{
						text: 'Producten', margin: [0, 10], style: 'subheader'
					},
					{
						style: 'demoTable',
						table: {
							headerRows: 1,
							widths: [30, '*', 50, 50, 50, 50],
							body: productTable
						}
					}
				],
				styles: {
					header: {
						bold: true,
						color: '#000',
						fontSize: 15,
						decoration: 'underline',
						decorationColor: '#000',
						margin: [0, 15]
					},
					subheader: {
						bold: true,
						color: '#000',
						fontSize: 13,
						decoration: 'underline',
						decorationColor: '#000',
						margin: [0, 10]
					},
					demoTable: {
						color: '#666',
						fontSize: 10
					},
					tableHeader: {
						color: '#000',
						fontSize: 10,
						bold: true
					}
				},
				pageSize: 'A4'
			};
			pdfMake.createPdf(docDefinition).download(`${order.ordernumber ? order.ordernumber + '_' : ''}${order.name}`);
		}

		this.sortProductsBySKU = function (a, b) {
			const skuA = isNaN(Number(a.product.code)) ? 0 : Number(a.product.code);
			const skuB = isNaN(Number(b.product.code)) ? 0 : Number(b.product.code);
			return skuA < skuB ? -1 : skuA === skuB ? 0 : 1;
		}

		this.sortProductsByName = function (a, b) {
			const nameA = a.product.name;
			const nameB = b.product.name;
			return nameA < nameB ? -1 : nameA === nameB ? 0 : 1;
		}

		this.orderContainsProduct = function (order, product) {
			let id = typeof(product) === 'object'? product._id: product;
			return order.products.filter(item => item.product._id === id).length > 0;
		}

	});
