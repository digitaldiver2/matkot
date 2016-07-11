'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var settingsCtrlStub = {
  index: 'settingsCtrl.index',
  show: 'settingsCtrl.show',
  create: 'settingsCtrl.create',
  update: 'settingsCtrl.update',
  destroy: 'settingsCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var settingsIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './settings.controller': settingsCtrlStub
});

describe('Settings API Router:', function() {

  it('should return an express router instance', function() {
    settingsIndex.should.equal(routerStub);
  });

  describe('GET /api/settingss', function() {

    it('should route to settings.controller.index', function() {
      routerStub.get
        .withArgs('/', 'settingsCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/settingss/:id', function() {

    it('should route to settings.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'settingsCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/settingss', function() {

    it('should route to settings.controller.create', function() {
      routerStub.post
        .withArgs('/', 'settingsCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/settingss/:id', function() {

    it('should route to settings.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'settingsCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/settingss/:id', function() {

    it('should route to settings.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'settingsCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/settingss/:id', function() {

    it('should route to settings.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'settingsCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
