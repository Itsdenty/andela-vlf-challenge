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

  var token = '';

  var login = {
    login: {
      email: 'coding-muse@gmail.com',
      password: 'ispassword'
    }
  };

  var user = {
    user: {}
  };

  describe('#POST / user login', function () {
    it('should login a user', function (done) {
      (0, _supertest2.default)(_index2.default).post('/api/v1/auth/login').send(login).end(function (err, res) {
        if (err) return done(err);
        (0, _chai.expect)(res.statusCode).to.equal(200);
        (0, _chai.expect)(res.body).to.be.an('object');
        (0, _chai.expect)(res.body.data).to.be.an('object');
        (0, _chai.expect)(res.body.status).to.equal(200);
        user.user.id = res.body.data.user.id;
        token = 'Bearer ' + res.body.data.token;
        parcel.parcel.placedBy = user.user.id;
        done();
      });
    });
  });
  describe('#POST / parcels', function () {
    it('should create a parcel order', function (done) {
      (0, _supertest2.default)(_index2.default).post('/api/v1/parcels').send(parcel).set('Authorization', token).end(function (err, res) {
        if (err) return done(err);
        (0, _chai.expect)(res.statusCode).to.equal(200);
        (0, _chai.expect)(res.body).to.be.an('object');
        (0, _chai.expect)(res.body.data).to.be.an('object');
        (0, _chai.expect)(res.body.status).to.equal(200);
        parcel.parcel = res.body.data.parcel;
        done();
      });
    });
  });
});