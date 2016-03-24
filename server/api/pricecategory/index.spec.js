'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var pricecategoryCtrlStub = {
  index: 'pricecategoryCtrl.index',
  show: 'pricecategoryCtrl.show',
  create: 'pricecategoryCtrl.create',
  update: 'pricecategoryCtrl.update',
  destroy: 'pricecategoryCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var pricecategoryIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './pricecategory.controller': pricecategoryCtrlStub
});

describe('Pricecategory API Router:', function() {

  it('should return an express router instance', function() {
    pricecategoryIndex.should.equal(routerStub);
  });

  describe('GET /api/pricecategorys', function() {

    it('should route to pricecategory.controller.index', function() {
      routerStub.get
        .withArgs('/', 'pricecategoryCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/pricecategorys/:id', function() {

    it('should route to pricecategory.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'pricecategoryCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/pricecategorys', function() {

    it('should route to pricecategory.controller.create', function() {
      routerStub.post
        .withArgs('/', 'pricecategoryCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/pricecategorys/:id', function() {

    it('should route to pricecategory.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'pricecategoryCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/pricecategorys/:id', function() {

    it('should route to pricecategory.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'pricecategoryCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/pricecategorys/:id', function() {

    it('should route to pricecategory.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'pricecategoryCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
