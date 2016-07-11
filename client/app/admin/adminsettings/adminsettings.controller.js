'use strict';
(function(){

class AdminsettingsComponent {
  constructor($scope, $http) {
  	this.$http = $http;
    this.settings = {}
    this.$http.get('/api/settings').then (response => {
    	this.settings = response.data;
    });
  }

  calculateResult () {
  	if (this.settings.ordercounter != undefined) {
	  	var number = this.settings.ordercounter;
	  	var width = this.settings.ordernumberwidth;
	  	var prefix = this.settings.orderprefix;
	  	var strnumber = number.toString();
	  	var numberlength = strnumber.length;

	  	var result = prefix;
	  	for (var i=0; i< width - numberlength; i++) {
	  		result = result + '0';
	  	}
	  	result = result + strnumber;
	  	return result;
  	}
  }

  save () {
  	alert('saving');
  	this.$http.put('/api/settings/' + this.settings._id, this.settings).then (response => {
  		console.log('success!!');
  	});
  }
}

angular.module('matkotApp.admin')
  .component('adminsettings', {
    templateUrl: 'app/admin/adminsettings/adminsettings.html',
    controller: AdminsettingsComponent
  });

})();
