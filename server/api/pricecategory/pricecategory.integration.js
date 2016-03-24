'use strict';

var app = require('../..');
import request from 'supertest';

var newPricecategory;

describe('Pricecategory API:', function() {

  describe('GET /api/pricecategorys', function() {
    var pricecategorys;

    beforeEach(function(done) {
      request(app)
        .get('/api/pricecategorys')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          pricecategorys = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      pricecategorys.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/pricecategorys', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/pricecategorys')
        .send({
          name: 'New Pricecategory',
          info: 'This is the brand new pricecategory!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newPricecategory = res.body;
          done();
        });
    });

    it('should respond with the newly created pricecategory', function() {
      newPricecategory.name.should.equal('New Pricecategory');
      newPricecategory.info.should.equal('This is the brand new pricecategory!!!');
    });

  });

  describe('GET /api/pricecategorys/:id', function() {
    var pricecategory;

    beforeEach(function(done) {
      request(app)
        .get('/api/pricecategorys/' + newPricecategory._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          pricecategory = res.body;
          done();
        });
    });

    afterEach(function() {
      pricecategory = {};
    });

    it('should respond with the requested pricecategory', function() {
      pricecategory.name.should.equal('New Pricecategory');
      pricecategory.info.should.equal('This is the brand new pricecategory!!!');
    });

  });

  describe('PUT /api/pricecategorys/:id', function() {
    var updatedPricecategory;

    beforeEach(function(done) {
      request(app)
        .put('/api/pricecategorys/' + newPricecategory._id)
        .send({
          name: 'Updated Pricecategory',
          info: 'This is the updated pricecategory!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedPricecategory = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedPricecategory = {};
    });

    it('should respond with the updated pricecategory', function() {
      updatedPricecategory.name.should.equal('Updated Pricecategory');
      updatedPricecategory.info.should.equal('This is the updated pricecategory!!!');
    });

  });

  describe('DELETE /api/pricecategorys/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/pricecategorys/' + newPricecategory._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when pricecategory does not exist', function(done) {
      request(app)
        .delete('/api/pricecategorys/' + newPricecategory._id)
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
