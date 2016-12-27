'use strict';

describe('Component: MainInfoComponent', function () {

  // load the controller's module
  beforeEach(module('matkotApp'));

  var MainInfoComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    MainInfoComponent = $componentController('MainInfoComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
