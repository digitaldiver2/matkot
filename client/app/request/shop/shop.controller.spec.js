'use strict';

describe('Component: ShopComponent', function () {

  // load the controller's module
  beforeEach(module('matkotApp'));

  var ShopComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    ShopComponent = $componentController('ShopComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
