'use strict';

describe('Filter: totalSumPriceQty', function () {

  // load the filter's module
  beforeEach(module('matkotApp'));

  // initialize a new instance of the filter before each test
  var totalSumPriceQty;
  beforeEach(inject(function ($filter) {
    totalSumPriceQty = $filter('totalSumPriceQty');
  }));

  it('should return the input prefixed with "totalSumPriceQty filter:"', function () {
    var text = 'angularjs';
    expect(totalSumPriceQty(text)).toBe('totalSumPriceQty filter: ' + text);
  });

});
