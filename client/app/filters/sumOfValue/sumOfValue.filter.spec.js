'use strict';

describe('Filter: sumOfValue', function () {

  // load the filter's module
  beforeEach(module('matkotApp'));

  // initialize a new instance of the filter before each test
  var sumOfValue;
  beforeEach(inject(function ($filter) {
    sumOfValue = $filter('sumOfValue');
  }));

  it('should return the input prefixed with "sumOfValue filter:"', function () {
    var text = 'angularjs';
    expect(sumOfValue(text)).toBe('sumOfValue filter: ' + text);
  });

});
