'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var usergroupCtrlStub = {
  index: 'usergroupCtrl.index',
  show: 'usergroupCtrl.show',
  create: 'usergroupCtrl.create',
  update: 'usergroupCtrl.update',
  destroy: 'usergroupCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var usergroupIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './usergroup.controller': usergroupCtrlStub
});

describe('Usergroup API Router:', function() {

  it('should return an express router instance', function() {
    usergroupIndex.should.equal(routerStub);
  });

  describe('GET /api/usergroups', function() {

    it('should route to usergroup.controller.index', function() {
      routerStub.get
        .withArgs('/', 'usergroupCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/usergroups/:id', function() {

    it('should route to usergroup.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'usergroupCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/usergroups', function() {

    it('should route to usergroup.controller.create', function() {
      routerStub.post
        .withArgs('/', 'usergroupCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/usergroups/:id', function() {

    it('should route to usergroup.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'usergroupCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/usergroups/:id', function() {

    it('should route to usergroup.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'usergroupCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/usergroups/:id', function() {

    it('should route to usergroup.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'usergroupCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
