'use strict';

describe('Component: ProductComponent', function () {

  // load the controller's module
  beforeEach(module('matkotApp'));

  var ProductComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    ProductComponent = $componentController('ProductComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
