'use strict';
(function () {
  class MkTable {

    constructor($scope) {
      this.$scope = $scope;

    }

    $onInit() {
      // this.itemColumns = [
      //   {
      //     title: 'Naam',
      //     field: 'name'
      //   },
      //   {
      //     title: 'Afhaaldatum',
      //     field: 'pickupdate',
      //     type: 'date'
      //   },
      //   {
      //     title: '# aanvragen',
      //     field: 'orders.length',
      //   }
      // ]
    }

    getField(item, field) {
      if (!item || !field)
        return undefined;
      let levels = field.split(".");
      let value = item;
      levels.some(field => {
        if (value === undefined || value == null) {
          return true;
        }
        if (field === 'length') {
          value = value.length;
        } else {
          value = value[field];
        }
      });
      return value;
    }

    removeItem($event, item) {
      this.onremove({ item: item });
      $event.stopPropagation();
    }

    addItem($event, item) {
      this.onadd({ item: item });
      $event.stopPropagation();
    }

  }

  angular.module('matkotApp')
    .component('mkTable', {
      templateUrl: 'components/mk-table/mk-table.html',
      controller: MkTable,
      bindings: {
        items: '<',
        showremove: '<',
        onremove: '&',
        clickevent: '&',
        itemcolumns: '<',
        showadd: '<',
        additems: '<',
        additemdisplayfield: '<',
        onadd: '&',
        filterobject: '<'
      },
    })
})();
