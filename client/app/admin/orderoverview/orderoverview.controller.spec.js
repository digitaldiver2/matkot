'use strict';

describe('Component: OrderoverviewComponent', function () {

  // load the controller's module
  beforeEach(module('matkotApp.admin'));

  var OrderoverviewComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    OrderoverviewComponent = $componentController('OrderoverviewComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
