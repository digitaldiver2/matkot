'use strict';

describe('Component: OrderComponent', function () {

  // load the controller's module
  beforeEach(module('matkotApp.admin'));

  var OrderComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    OrderComponent = $componentController('OrderComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
