'use strict';

var _chai = require('chai');

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 *
 * @returns {String} fstring
 */

describe('User API endpoints intgeration Tests', function () {
  var parcel = {
    parcel: {
      placedBy: 1,
      weight: 3,
      weightmetric: 'kg',
      fromLocation: 'test to location',
      toLocation: 'test from location'
    }
  };

  var parcel400 = {
    parcel: {
      placedBy: 1,
      weight: 'awesome',
      weightmetric: 'kg',
      fromLocation: 'test to location',
      toLocation: 'test from location'
    }
  };

  var parcel500 = {
    parcel: {
      placedBy: 0,
      weight: 3,
      weightmetric: 'kg',
      fromLocation: 'test to location',
      toLocation: 'test from location'
    }
  };
  var token = '';

  var login = {
    login: {
      email: 'coding-muse@gmail.com',
      password: 'ispassword'
    }
  };
  var token401 = 'awesome-token-for-us';

  describe('#POST / user login', function () {
    it('should login a user', function (done) {
      (0, _supertest2.default)(_index2.default).post('/api/v1/auth/login').send(login).end(function (err, res) {
        if (err) return done(err);
        (0, _chai.expect)(res.statusCode).to.equal(200);
        (0, _chai.expect)(res.body).to.be.an('object');
        (0, _chai.expect)(res.body.data).to.be.an('object');
        (0, _chai.expect)(res.body.status).to.equal(200);
        token = 'Bearer ' + res.body.data.token;
        done();
      });
    });
  });
  describe('#POST / parcels', function () {
    it('should create a parcel order', function (done) {
      (0, _supertest2.default)(_index2.default).post('/api/v1/parcels').send(parcel).set('Authorization', token).end(function (err, res) {
        if (err) return done(err);
        (0, _chai.expect)(res.statusCode).to.equal(200);
        (0, _chai.expect)(res.body.status).to.equal(200);
        (0, _chai.expect)(res.body).to.be.an('object');
        (0, _chai.expect)(res.body.data).to.be.an('object');
        parcel.parcel = res.body.data.parcel;
        done();
      });
    });
  });

  describe('#POST / parcels', function () {
    it('should throw a 400 error for a parcel order', function (done) {
      (0, _supertest2.default)(_index2.default).post('/api/v1/parcels').send(parcel400).set('Authorization', token).end(function (err, res) {
        if (err) return done(err);
        (0, _chai.expect)(res.statusCode).to.equal(400);
        (0, _chai.expect)(res.body.status).to.equal(400);
        (0, _chai.expect)(res.body).to.be.an('object');
        (0, _chai.expect)(res.body.error).to.have.string('valid');
        done();
      });
    });
  });

  describe('#POST / parcels', function () {
    it('should throw a 500 error for a parcel order', function (done) {
      (0, _supertest2.default)(_index2.default).post('/api/v1/parcels').send(parcel500).set('Authorization', token).end(function (err, res) {
        if (err) return done(err);
        (0, _chai.expect)(res.statusCode).to.equal(200);
        (0, _chai.expect)(res.body.status).to.equal(500);
        (0, _chai.expect)(res.body).to.be.an('object');
        (0, _chai.expect)(res.body.error).to.have.string('occured');
        done();
      });
    });
  });

  describe('#POST / parcels', function () {
    it('should throw a 401 error for a parcel order', function (done) {
      (0, _supertest2.default)(_index2.default).post('/api/v1/parcels').send(parcel).set('Authorization', token401).end(function (err, res) {
        if (err) return done(err);
        (0, _chai.expect)(res.statusCode).to.equal(401);
        (0, _chai.expect)(res.body.status).to.equal(401);
        (0, _chai.expect)(res.body).to.be.an('object');
        (0, _chai.expect)(res.body.error).to.have.string('malformed');
        done();
      });
    });
  });

  describe('#POST / parcels', function () {
    it('should throw a 500 error for a parcel order', function (done) {
      (0, _supertest2.default)(_index2.default).post('/api/v1/parcels').send(parcel500).set('Authorization', token).end(function (err, res) {
        if (err) return done(err);
        (0, _chai.expect)(res.statusCode).to.equal(200);
        (0, _chai.expect)(res.body.status).to.equal(500);
        (0, _chai.expect)(res.body).to.be.an('object');
        (0, _chai.expect)(res.body.error).to.have.string('occured');
        done();
      });
    });
  });

  describe('#POST / parcels', function () {
    it('should throw a 403 error for a parcel order', function (done) {
      (0, _supertest2.default)(_index2.default).post('/api/v1/parcels').send(parcel).end(function (err, res) {
        if (err) return done(err);
        (0, _chai.expect)(res.statusCode).to.equal(403);
        (0, _chai.expect)(res.body.status).to.equal(403);
        (0, _chai.expect)(res.body).to.be.an('object');
        (0, _chai.expect)(res.body.error).to.have.string('provided');
        done();
      });
    });
  });
});