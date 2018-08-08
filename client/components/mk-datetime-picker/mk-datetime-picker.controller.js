'use strict';
(function () {
  class MkDateTimePicker {

    constructor() {
      this.showPopup = false;
      this.format = 'EEE dd/MM/yy';
    }

    $onInit() {
    }

  }

  angular.module('matkotApp')
    .component('mkDatetimePicker', {
      templateUrl: 'components/mk-datetime-picker/mk-datetime-picker.html',
      controller: MkDateTimePicker,
      bindings: {
        value: '<',
        dayclassfct: '&',
        datepickeroptions: '<',
        fixedtime: '<',
        enabled: '<',
        disabledatesfct: '&',
        ondatechanged: '&',
        dateonly: '<'
      },
    })
})();
