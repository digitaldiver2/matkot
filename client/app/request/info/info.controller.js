'use strict';
(function(){

class InfoComponent {
	constructor($scope, Auth, $stateParams, $location, $http) {
		this.getCurrentUser = Auth.getCurrentUser;
		this.$scope = $scope;
		this.$location = $location;
		this.$http = $http;
		this.$scope.user = Auth.getCurrentUser();
		this.id = $stateParams.id;
		this.$scope.request = {};
	}

	$onInit () {
		if (this.id) {
	  		//load request
	  		this.$http.get('/api/orders/' + this.id).then(response => {
		        this.$scope.request = response.data;
		        this.$scope.request.eventstart = new Date(this.$scope.request.eventstart );
		        this.$scope.request.eventstop = new Date(this.$scope.request.eventstop );
		        this.$scope.request.pickupdate = new Date(this.$scope.request.pickupdate );
		        this.$scope.request.returndate = new Date(this.$scope.request.returndate );
	      	});
  		}
  		this.isNoDraft();
    }

  	submit (proceed) {
  		//don't update if not in draft mode
  		if (!this.isNoDraft()) {
			this.$scope.request.modifier = this.$scope.user._id;
		  	if (this.id) {
		  		this.$scope.request.owner = this.$scope.user._id;
		  		this.$http.put('/api/orders/' + this.id, this.$scope.request);
				if (proceed) {
					this.$location.path('/request/shop/' + this.id);
				} else {
					this.$location.path('/orders');
				}
		  	} else {
		  		this.$scope.request.creator = this.$scope.user._id;
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
		var result = (this.id == undefined || this.id == '') || (this.$scope.request && this.$scope.request.state == 'DRAFT');
		console.log('is draft? ' + result);
	    return !result;
	}
}

angular.module('matkotApp')
  .component('info', {
    templateUrl: 'app/request/info/info.html',
    controller: InfoComponent
  });

})();