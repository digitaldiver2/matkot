'use strict';

describe('Component: AdminsettingsComponent', function () {

  // load the controller's module
  beforeEach(module('matkotApp.admin'));

  var AdminsettingsComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    AdminsettingsComponent = $componentController('AdminsettingsComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
