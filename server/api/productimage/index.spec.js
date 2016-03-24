'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var productimageCtrlStub = {
  index: 'productimageCtrl.index',
  show: 'productimageCtrl.show',
  create: 'productimageCtrl.create',
  update: 'productimageCtrl.update',
  destroy: 'productimageCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var productimageIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './productimage.controller': productimageCtrlStub
});

describe('Productimage API Router:', function() {

  it('should return an express router instance', function() {
    productimageIndex.should.equal(routerStub);
  });

  describe('GET /api/productimages', function() {

    it('should route to productimage.controller.index', function() {
      routerStub.get
        .withArgs('/', 'productimageCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/productimages/:id', function() {

    it('should route to productimage.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'productimageCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/productimages', function() {

    it('should route to productimage.controller.create', function() {
      routerStub.post
        .withArgs('/', 'productimageCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/productimages/:id', function() {

    it('should route to productimage.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'productimageCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/productimages/:id', function() {

    it('should route to productimage.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'productimageCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/productimages/:id', function() {

    it('should route to productimage.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'productimageCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
