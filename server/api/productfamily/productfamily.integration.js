'use strict';

var app = require('../..');
import request from 'supertest';

var newProductfamily;

describe('Productfamily API:', function() {

  describe('GET /api/productfamilys', function() {
    var productfamilys;

    beforeEach(function(done) {
      request(app)
        .get('/api/productfamilys')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          productfamilys = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      productfamilys.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/productfamilys', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/productfamilys')
        .send({
          name: 'New Productfamily',
          info: 'This is the brand new productfamily!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newProductfamily = res.body;
          done();
        });
    });

    it('should respond with the newly created productfamily', function() {
      newProductfamily.name.should.equal('New Productfamily');
      newProductfamily.info.should.equal('This is the brand new productfamily!!!');
    });

  });

  describe('GET /api/productfamilys/:id', function() {
    var productfamily;

    beforeEach(function(done) {
      request(app)
        .get('/api/productfamilys/' + newProductfamily._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          productfamily = res.body;
          done();
        });
    });

    afterEach(function() {
      productfamily = {};
    });

    it('should respond with the requested productfamily', function() {
      productfamily.name.should.equal('New Productfamily');
      productfamily.info.should.equal('This is the brand new productfamily!!!');
    });

  });

  describe('PUT /api/productfamilys/:id', function() {
    var updatedProductfamily;

    beforeEach(function(done) {
      request(app)
        .put('/api/productfamilys/' + newProductfamily._id)
        .send({
          name: 'Updated Productfamily',
          info: 'This is the updated productfamily!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedProductfamily = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedProductfamily = {};
    });

    it('should respond with the updated productfamily', function() {
      updatedProductfamily.name.should.equal('Updated Productfamily');
      updatedProductfamily.info.should.equal('This is the updated productfamily!!!');
    });

  });

  describe('DELETE /api/productfamilys/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/productfamilys/' + newProductfamily._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when productfamily does not exist', function(done) {
      request(app)
        .delete('/api/productfamilys/' + newProductfamily._id)
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
