'use strict';

describe('Component: StockCountComponent', function () {

  // load the controller's module
  beforeEach(module('matkotApp.admin'));

  var StockCountComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    StockCountComponent = $componentController('StockCountComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
