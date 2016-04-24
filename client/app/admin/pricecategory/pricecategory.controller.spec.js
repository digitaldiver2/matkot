'use strict';

describe('Component: PricecategoryComponent', function () {

  // load the controller's module
  beforeEach(module('matkotApp'));

  var PricecategoryComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    PricecategoryComponent = $componentController('PricecategoryComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
