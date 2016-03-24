'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var productfamilyCtrlStub = {
  index: 'productfamilyCtrl.index',
  show: 'productfamilyCtrl.show',
  create: 'productfamilyCtrl.create',
  update: 'productfamilyCtrl.update',
  destroy: 'productfamilyCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var productfamilyIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './productfamily.controller': productfamilyCtrlStub
});

describe('Productfamily API Router:', function() {

  it('should return an express router instance', function() {
    productfamilyIndex.should.equal(routerStub);
  });

  describe('GET /api/productfamilys', function() {

    it('should route to productfamily.controller.index', function() {
      routerStub.get
        .withArgs('/', 'productfamilyCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/productfamilys/:id', function() {

    it('should route to productfamily.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'productfamilyCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/productfamilys', function() {

    it('should route to productfamily.controller.create', function() {
      routerStub.post
        .withArgs('/', 'productfamilyCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/productfamilys/:id', function() {

    it('should route to productfamily.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'productfamilyCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/productfamilys/:id', function() {

    it('should route to productfamily.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'productfamilyCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/productfamilys/:id', function() {

    it('should route to productfamily.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'productfamilyCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
