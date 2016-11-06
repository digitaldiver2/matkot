'use strict';

angular.module('matkotApp')
  .directive('orderList', function () {
    return {
      templateUrl: 'app/directives/orderList/orderList.html',
      restrict: 'E',
      transclude: true,
      scope: {
      	list: '=',
      	clickEvent: '&',
      	deletable: '&',
      	deleteItem: '&',
        listOptions: '='
      },
      link: function (scope, element, attrs) {
      },
      controller: function ($scope) {
        $scope.sortType = $scope.listOptions.orderByColumn;
        $scope.sortReversed = false;

        $scope.sort = function (column) {
          $scope.sortType = 'order.' + column;
          $scope.sortReversed = !$scope.sortReversed;
        }
      }
    };
  });
/*
listoptions: {
  itemClickEvent: 
  columns: [
  {
    title: '',
    itemMember: '',
    sortable: True,
  }]
}
*/