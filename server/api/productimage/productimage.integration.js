'use strict';

var app = require('../..');
import request from 'supertest';

var newProductimage;

describe('Productimage API:', function() {

  describe('GET /api/productimages', function() {
    var productimages;

    beforeEach(function(done) {
      request(app)
        .get('/api/productimages')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          productimages = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      productimages.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/productimages', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/productimages')
        .send({
          name: 'New Productimage',
          info: 'This is the brand new productimage!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newProductimage = res.body;
          done();
        });
    });

    it('should respond with the newly created productimage', function() {
      newProductimage.name.should.equal('New Productimage');
      newProductimage.info.should.equal('This is the brand new productimage!!!');
    });

  });

  describe('GET /api/productimages/:id', function() {
    var productimage;

    beforeEach(function(done) {
      request(app)
        .get('/api/productimages/' + newProductimage._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          productimage = res.body;
          done();
        });
    });

    afterEach(function() {
      productimage = {};
    });

    it('should respond with the requested productimage', function() {
      productimage.name.should.equal('New Productimage');
      productimage.info.should.equal('This is the brand new productimage!!!');
    });

  });

  describe('PUT /api/productimages/:id', function() {
    var updatedProductimage;

    beforeEach(function(done) {
      request(app)
        .put('/api/productimages/' + newProductimage._id)
        .send({
          name: 'Updated Productimage',
          info: 'This is the updated productimage!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedProductimage = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedProductimage = {};
    });

    it('should respond with the updated productimage', function() {
      updatedProductimage.name.should.equal('Updated Productimage');
      updatedProductimage.info.should.equal('This is the updated productimage!!!');
    });

  });

  describe('DELETE /api/productimages/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/productimages/' + newProductimage._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when productimage does not exist', function(done) {
      request(app)
        .delete('/api/productimages/' + newProductimage._id)
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
