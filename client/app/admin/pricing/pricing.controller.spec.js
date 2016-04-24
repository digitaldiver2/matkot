'use strict';

describe('Component: PricingComponent', function () {

  // load the controller's module
  beforeEach(module('matkotApp'));

  var PricingComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    PricingComponent = $componentController('PricingComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
