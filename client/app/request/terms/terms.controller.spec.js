'use strict';

describe('Component: TermsComponent', function () {

  // load the controller's module
  beforeEach(module('matkotApp'));

  var TermsComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    TermsComponent = $componentController('TermsComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
