'use strict';
(function(){

class InfoComponent {
	constructor($scope, Auth, $stateParams, $location, $http) {
		this.getCurrentUser = Auth.getCurrentUser;
		this.$scope = $scope;
		this.$location = $location;
		this.$http = $http;
		this.Auth = Auth;
		this.id = $stateParams.id;
		this.$scope.request = {};
		this.$scope.isDraft = false;
		this.test = false;

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

	$onInit () {

		this.$scope.user = this.Auth.getCurrentUser(user => {
			if (user) {
				this.$scope.user = user;
				if (this.id) {
			  		//load request
			  		this.$http.get('/api/orders/' + this.id).then(response => {
				        this.$scope.request = response.data;
						// this.setGroupSelected(this.$scope.request.group);
						
						// don't set presets for empty dates, but force the user to fill them in
				        if (this.$scope.request.eventstart != undefined)
							this.$scope.request.eventstart = new Date(this.$scope.request.eventstart );
				        if (this.$scope.request.eventstop != undefined)
				        	this.$scope.request.eventstop = new Date(this.$scope.request.eventstop );
				        if (this.$scope.request.pickupdate != undefined)
				        	this.$scope.request.pickupdate = new Date(this.$scope.request.pickupdate );
				        if (this.$scope.request.returndate != undefined)
				        	this.$scope.request.returndate = new Date(this.$scope.request.returndate );

				        this.isNoDraft();
			      	});
		  		} else {	
		  			this.isNoDraft();
		  		}
			} else {
				console.log('error loading user');
			}
		});

		// test code
		this.$scope.popups = {
			'eventstart': false,
			'eventstop': false,
			'pickupdate': false,
			'returndate': false,
		}
		this.$scope.format = 'EEE dd/MM/yy';
	}

	closedDates (date, mode) {
		return mode === 'day' && date.getDay() != 3;
	};

	changePickupDate() {
		this.$scope.request.pickupdate.setHours(20);
		this.$scope.request.pickupdate.setMinutes(30);
		console.log(this.$scope.request.pickupdate);
	}

	changeReturnDate() {
		this.$scope.request.returndate.setHours(20);
		this.$scope.request.returndate.setMinutes(0);
		console.log(this.$scope.request.returndate);
	}

	openEventStart() {
		if (this.$scope.request.eventstop !== null && this.$scope.request.eventstop !== undefined) {
			this.eventstartoptions.maxDate = this.$scope.request.eventstop;
			console.log('a')
		} else {
			this.eventstartoptions.maxDate = undefined
			console.log('c')
		}
		this.open('eventstart');
	}

	openEventStop() {
		if (this.$scope.request.eventstart !== null && this.$scope.request.eventstart !== undefined) {
			this.eventstopoptions.minDate = this.$scope.request.eventstart;
			console.log('d')
		} else {
			this.eventstopoptions.minDate = undefined 
			console.log('e')
		}
		this.open('eventstop');
	}

	openPickup() {
		if (this.$scope.request.eventstart !== null && this.$scope.request.eventstart !== undefined) {
			this.pickupoptions.maxDate = this.$scope.request.eventstart;
			this.pickupoptions.initDate = this.$scope.request.eventstart;
			console.log('d')
		} else {
			this.pickupoptions.maxDate = undefined 
			console.log('e')
		}
		this.open('pickupdate');
	}
	
	openReturn() {
		if (this.$scope.request.eventstop !== null && this.$scope.request.eventstop !== undefined) {
			this.retouroptions.minDate = this.$scope.request.eventstop;
			this.pickupoptions.initDate = this.$scope.request.eventstop;
			console.log('d')
		} else {
			this.eventstopoptions.minDate = undefined 
			console.log('e')
		}
		this.open('returndate');
	}

	open(popupname) {
		this.$scope.popups[popupname] =  true;
	}

  	submit (proceed) {
  		//don't update if not in draft mode
  		if (this.isDraft()) {
			this.$scope.request.modifier = this.$scope.user._id;
		  	if (this.id) {
		  		this.$http.put('/api/orders/' + this.id, this.$scope.request);
				if (proceed) {
					this.$location.path('/request/shop/' + this.id);
				} else {
					this.$location.path('/orders');
				}
		  	} else {
		  		this.$scope.request.creator = this.$scope.user._id;
		  		this.$scope.request.owner = this.$scope.user._id;
				this.$http.post('/api/orders/', this.$scope.request).then(response => {
					if (proceed) {
						this.$location.path('/request/shop/' + response.data._id);
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

	isNoDraft () {
		// if id is not set, it's a draft, or if the state of te request is 'DRAFT'
		this.$scope.isDraft = (this.id == undefined || this.id == '') || (this.$scope.request && this.$scope.request.state == 'DRAFT');
	    return !this.$scope.isDraft;
	}

	isDraft () {
		return !this.$scope.isNoDraft();
	}

	isEventDefined () {
		const result = this.$scope.request.eventstart !== null && this.$scope.request.eventstart !== undefined 
		 && this.$scope.request.eventstart !== null && this.$scope.request.eventstart !== undefined;
		console.log(result);
		return result;
	}
}

angular.module('matkotApp')
  .component('info', {
    templateUrl: 'app/request/info/info.html',
    controller: InfoComponent
  });

})();
