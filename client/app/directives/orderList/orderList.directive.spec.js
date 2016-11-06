'use strict';

describe('Directive: orderList', function () {

  // load the directive's module and view
  beforeEach(module('matkotApp.orderList'));
  beforeEach(module('app/directives/orderList/orderList.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<order-list></order-list>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the orderList directive');
  }));
});
