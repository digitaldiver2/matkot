'use strict';
(function(){

class TermsComponent {
  constructor($location) {
  	this.$location = $location;
  }

  Agree () {
  	this.$location.path ('/request/info/');
  }
}

angular.module('matkotApp')
  .component('terms', {
    templateUrl: 'app/request/terms/terms.html',
    controller: TermsComponent
  });

})();
