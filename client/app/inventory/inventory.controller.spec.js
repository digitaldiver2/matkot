'use strict';

describe('Component: InventoryComponent', function () {

  // load the controller's module
  beforeEach(module('matkotApp'));

  var InventoryComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    InventoryComponent = $componentController('InventoryComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
