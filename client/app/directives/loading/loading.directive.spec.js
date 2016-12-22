'use strict';

describe('Directive: loading', function () {

  // load the directive's module and view
  beforeEach(module('matkotApp'));
  beforeEach(module('app/directives/loading/loading.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<loading></loading>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the loading directive');
  }));
});
