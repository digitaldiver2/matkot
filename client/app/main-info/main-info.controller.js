'use strict';
(function(){

class MainInfoComponent {
  constructor() {
  }
}

angular.module('matkotApp')
  .component('mainInfo', {
    templateUrl: 'app/main-info/main-info.html',
    controller: MainInfoComponent
  });

})();
