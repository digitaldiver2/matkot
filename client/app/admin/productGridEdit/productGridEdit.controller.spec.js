'use strict';

describe('Component: ProductGridEditComponent', function () {

  // load the controller's module
  beforeEach(module('matkotApp.admin'));

  var ProductGridEditComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    ProductGridEditComponent = $componentController('ProductGridEditComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
