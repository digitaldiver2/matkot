'use strict';

describe('Component: ProductcategoryComponent', function () {

  // load the controller's module
  beforeEach(module('matkotApp'));

  var ProductcategoryComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    ProductcategoryComponent = $componentController('ProductcategoryComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
