'use strict';

var app = require('../..');
import request from 'supertest';

var newUsergroup;

describe('Usergroup API:', function() {

  describe('GET /api/usergroups', function() {
    var usergroups;

    beforeEach(function(done) {
      request(app)
        .get('/api/usergroups')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          usergroups = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      usergroups.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/usergroups', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/usergroups')
        .send({
          name: 'New Usergroup',
          info: 'This is the brand new usergroup!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newUsergroup = res.body;
          done();
        });
    });

    it('should respond with the newly created usergroup', function() {
      newUsergroup.name.should.equal('New Usergroup');
      newUsergroup.info.should.equal('This is the brand new usergroup!!!');
    });

  });

  describe('GET /api/usergroups/:id', function() {
    var usergroup;

    beforeEach(function(done) {
      request(app)
        .get('/api/usergroups/' + newUsergroup._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          usergroup = res.body;
          done();
        });
    });

    afterEach(function() {
      usergroup = {};
    });

    it('should respond with the requested usergroup', function() {
      usergroup.name.should.equal('New Usergroup');
      usergroup.info.should.equal('This is the brand new usergroup!!!');
    });

  });

  describe('PUT /api/usergroups/:id', function() {
    var updatedUsergroup;

    beforeEach(function(done) {
      request(app)
        .put('/api/usergroups/' + newUsergroup._id)
        .send({
          name: 'Updated Usergroup',
          info: 'This is the updated usergroup!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedUsergroup = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedUsergroup = {};
    });

    it('should respond with the updated usergroup', function() {
      updatedUsergroup.name.should.equal('Updated Usergroup');
      updatedUsergroup.info.should.equal('This is the updated usergroup!!!');
    });

  });

  describe('DELETE /api/usergroups/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/usergroups/' + newUsergroup._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when usergroup does not exist', function(done) {
      request(app)
        .delete('/api/usergroups/' + newUsergroup._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
