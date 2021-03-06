'use strict';
(function () {

	class InfoComponent {
		constructor($scope, Auth, $stateParams, $location, $http, orderService) {
			this.getCurrentUser = Auth.getCurrentUser;
			this.$scope = $scope;
			this.$location = $location;
			this.$http = $http;
			this.orderService = orderService;
			this.Auth = Auth;
			this.id = $stateParams.id;
			this.$scope.request = {};
			this.$scope.isDraft = false;

			this.getDayClass = function (date, mode) {
				const classes = [];
				if (mode === 'day' && date) {
					if (moment(date).isBetween(this.$scope.request.eventstart, this.$scope.request.eventstop, 'day', '[]')) {
						classes.push('event');
					}
					if (moment(date).isSame(this.$scope.request.pickupdate, 'day')) {
						classes.push('pickup');
					}
					if (moment(date).isSame(this.$scope.request.returndate, 'day')) {
						classes.push('return');
					}
				}
				return classes.join(' ');
			}

			this.retouroptions = {
				minDate: null,
				maxDate: null,
				initDate: null,
				showWeeks: false
			};

			this.pickupoptions = {
				minDate: null,
				maxDate: null,
				initDate: null,
				showWeeks: false
			};

			this.eventstartoptions = {
				minDate: null,
				initDate: new Date(),
				showWeeks: false,
				maxDate: null
			};

			this.eventstopoptions = {
				minDate: null,
				initDate: new Date(),
				showWeeks: false,
				maxDate: null
			};

		}

		$onInit() {

			this.$scope.user = this.Auth.getCurrentUser(user => {
				if (user) {
					this.$scope.user = user;
					if (this.id) {
						//load request
						this.orderService.getOrder(this.id).then(order => {
							this.$scope.request = order;
							// this.setGroupSelected(this.$scope.request.group);

							// don't set presets for empty dates, but force the user to fill them in
							if (this.$scope.request.eventstart != undefined)
								this.$scope.request.eventstart = new Date(this.$scope.request.eventstart);
							if (this.$scope.request.eventstop != undefined)
								this.$scope.request.eventstop = new Date(this.$scope.request.eventstop);
							if (this.$scope.request.pickupdate != undefined)
								this.$scope.request.pickupdate = new Date(this.$scope.request.pickupdate);
							if (this.$scope.request.returndate != undefined)
								this.$scope.request.returndate = new Date(this.$scope.request.returndate);

							this.isNoDraft();
						});
					} else {
						this.isNoDraft();
					}
				} else {
					console.log('error loading user');
				}
			});

			// popup mgmt
			this.$scope.popups = {
				'eventstart': false,
				'eventstop': false,
				'pickupdate': false,
				'returndate': false,
			}

			this.$scope.events = [
				{
					date: new Date() + 1,
					status: 'start'
				}
			];
			this.$scope.format = 'EEE dd/MM/yy';
		}

		closedDates(date, mode) {
			return mode === 'day' && date.getDay() != 3;
		};

		changePickupDate(date) {
			this.$scope.request.pickupdate = date;
			this.$scope.request.pickupdate.setHours(20);
			this.$scope.request.pickupdate.setMinutes(30);
		}

		changeReturnDate(date) {
			this.$scope.request.returndate = date;
			this.$scope.request.returndate.setHours(20);
			this.$scope.request.returndate.setMinutes(0);
		}

		eventStartChanged(date) {
			this.$scope.request.eventstart = date;
			if (this.$scope.request.pickupdate && moment(this.$scope.request.eventstart).isBefore(this.$scope.request.pickupdate, 'day', '[]')) {
				this.$scope.request.pickupdate = undefined;
				console.log('eventstart was before pickupdate')
			}

			if (this.$scope.request.eventstop === undefined) {
				this.eventstopoptions.minDate = this.$scope.request.eventstart;
				this.eventstopoptions.initDate = this.$scope.request.eventstart;
			}
			if (this.$scope.request.eventstop && moment(this.$scope.request.eventstop).isBefore(this.$scope.request.eventstart, 'day', '[]')) {
				this.eventStopChanged(undefined);
				console.log('eventstop was before eventstart')
			}
			this.pickupoptions.initDate = this.$scope.request.pickupdate ? this.$scope.request.pickupdate : moment(this.$scope.request.eventstart).weekday(3 - 7).toDate()
			this.pickupoptions.maxDate = this.$scope.request.eventstart;
		}

		eventStopChanged(date) {
			this.$scope.request.eventstop = date;
			if (this.$scope.request.returndate && moment(this.$scope.request.eventstop).isAfter(this.$scope.request.returndate, 'day', '[]')) {
				this.$scope.request.returndate = undefined;
				console.log('eventstop was after returndate')
			}
			this.retouroptions.initDate = this.$scope.request.returndate ? this.$scope.request.returndate : moment(this.$scope.request.eventstop).weekday(3+7).toDate()
			this.retouroptions.minDate = this.$scope.request.eventstop;
		}

		submit(proceed) {
			//don't update if not in draft mode
			if (this.isDraft()) {
				this.$scope.request.modifier = this.$scope.user._id;
				if (this.id) {
					this.orderService.saveOrder(this.$scope.request);
					if (proceed) {
						this.$location.path('/request/shop/' + this.id);
					} else {
						this.$location.path('/orders');
					}
				} else {
					this.$scope.request.creator = this.$scope.user._id;
					this.$scope.request.owner = this.$scope.user._id;
					this.orderService.saveOrder(this.$scope.request).then(response => {
						if (proceed) {
							this.$location.path('/request/shop/' + response._id);
						} else {
							this.$location.path('/orders');
						}
					});
				}
			} else {
				if (proceed) {
					this.$location.path('/request/shop/' + this.$scope.request._id);
				} else {
					this.$location.path('/orders');
				}
			}
		}

		isNoDraft() {
			// if id is not set, it's a draft, or if the state of te request is 'DRAFT'
			this.$scope.isDraft = (this.id == undefined || this.id == '') || (this.$scope.request && this.$scope.request.state == 'DRAFT');
			return !this.$scope.isDraft;
		}

		isDraft() {
			return !this.isNoDraft();
		}

		isEventDefined() {
			const result = this.$scope.request.eventstart !== null && this.$scope.request.eventstart !== undefined
				&& this.$scope.request.eventstop !== null && this.$scope.request.eventstop !== undefined;
			return result;
		}
	}

	angular.module('matkotApp')
		.component('info', {
			templateUrl: 'app/request/info/info.html',
			controller: InfoComponent
		});

})();
