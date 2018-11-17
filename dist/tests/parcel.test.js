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
  },
      parcel400 = {
    parcel: {
      placedBy: 1,
      weight: 'awesome',
      weightmetric: 'kg',
      fromLocation: 'test to location',
      toLocation: 'test from location'
    }
  },
      parcel500 = {
    parcel: {
      placedBy: 0,
      weight: 3,
      weightmetric: 'kg',
      fromLocation: 'test to location',
      toLocation: 'test from location'
    }
  },
      login = {
    login: {
      email: 'coding-muse@gmail.com',
      password: 'ispassword'
    }
  },
      token401 = 'awesome-token-for-us',
      toLocation = { toLocation: 'Bodija Ibadan' },
      status = { status: 'delivered' };
  var parcelId = '',
      token = '';

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

  // create parcel tests
  describe('#POST / parcels', function () {
    it('should create a parcel order', function (done) {
      (0, _supertest2.default)(_index2.default).post('/api/v1/parcels').send(parcel).set('Authorization', token).end(function (err, res) {
        if (err) return done(err);
        (0, _chai.expect)(res.statusCode).to.equal(200);
        (0, _chai.expect)(res.body.status).to.equal(200);
        (0, _chai.expect)(res.body).to.be.an('object');
        (0, _chai.expect)(res.body.data).to.be.an('object');
        parcelId = res.body.data.id;
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
        (0, _chai.expect)(res.statusCode).to.equal(500);
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
        (0, _chai.expect)(res.statusCode).to.equal(500);
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

  // get a single parcel tests
  describe('#GET / parcel', function () {
    it('should get a single parcel order', function (done) {
      (0, _supertest2.default)(_index2.default).get('/api/v1/parcels/' + parcelId).set('Authorization', token).end(function (err, res) {
        if (err) return done(err);
        (0, _chai.expect)(res.statusCode).to.equal(200);
        (0, _chai.expect)(res.body.status).to.equal(200);
        (0, _chai.expect)(res.body).to.be.an('object');
        (0, _chai.expect)(res.body.data).to.be.an('object');
        (0, _chai.expect)(res.body.data.fromlocation).to.have.string('l');
        done();
      });
    });
  });

  describe('#GET / parcel', function () {
    it('should throw a 400 error for get a single parcel', function (done) {
      (0, _supertest2.default)(_index2.default).get('/api/v1/parcels/some').set('Authorization', token).end(function (err, res) {
        if (err) return done(err);
        (0, _chai.expect)(res.statusCode).to.equal(400);
        (0, _chai.expect)(res.body.status).to.equal(400);
        (0, _chai.expect)(res.body).to.be.an('object');
        (0, _chai.expect)(res.body.error).to.have.string('valid');
        done();
      });
    });
  });
  describe('#GET / parcels', function () {
    it('should throw a 401 error for getting a single parcel', function (done) {
      (0, _supertest2.default)(_index2.default).get('/api/v1/parcels/' + parcelId).set('Authorization', token401).end(function (err, res) {
        if (err) return done(err);
        (0, _chai.expect)(res.statusCode).to.equal(401);
        (0, _chai.expect)(res.body.status).to.equal(401);
        (0, _chai.expect)(res.body).to.be.an('object');
        (0, _chai.expect)(res.body.error).to.have.string('malformed');
        done();
      });
    });
  });

  describe('#GET / parcels', function () {
    it('should throw a 403 error for getting a single parcel', function (done) {
      (0, _supertest2.default)(_index2.default).get('/api/v1/parcels/' + parcelId).end(function (err, res) {
        if (err) return done(err);
        (0, _chai.expect)(res.statusCode).to.equal(403);
        (0, _chai.expect)(res.body.status).to.equal(403);
        (0, _chai.expect)(res.body).to.be.an('object');
        (0, _chai.expect)(res.body.error).to.have.string('provided');
        done();
      });
    });
  });

  // get all parcels tests
  describe('#GET / parcels', function () {
    it('should get al parcels order', function (done) {
      (0, _supertest2.default)(_index2.default).get('/api/v1/parcels').set('Authorization', token).end(function (err, res) {
        if (err) return done(err);
        (0, _chai.expect)(res.statusCode).to.equal(200);
        (0, _chai.expect)(res.body.status).to.equal(200);
        (0, _chai.expect)(res.body).to.be.an('object');
        (0, _chai.expect)(res.body.data[0]).to.be.an('object');
        (0, _chai.expect)(res.body.data[0].fromlocation).to.have.string('test');
        done();
      });
    });
  });

  describe('#GET / parcels', function () {
    it('should throw a 401 error for a parcel order', function (done) {
      (0, _supertest2.default)(_index2.default).get('/api/v1/parcels').set('Authorization', token401).end(function (err, res) {
        if (err) return done(err);
        (0, _chai.expect)(res.statusCode).to.equal(401);
        (0, _chai.expect)(res.body.status).to.equal(401);
        (0, _chai.expect)(res.body).to.be.an('object');
        (0, _chai.expect)(res.body.error).to.have.string('malformed');
        done();
      });
    });
  });

  describe('#GET / parcels', function () {
    it('should throw a 403 error for a parcel order', function (done) {
      (0, _supertest2.default)(_index2.default).get('/api/v1/parcels').end(function (err, res) {
        if (err) return done(err);
        (0, _chai.expect)(res.statusCode).to.equal(403);
        (0, _chai.expect)(res.body.status).to.equal(403);
        (0, _chai.expect)(res.body).to.be.an('object');
        (0, _chai.expect)(res.body.error).to.have.string('provided');
        done();
      });
    });
  });

  // cancel a single parcel tests
  describe('#PATCH / parcel', function () {
    it('should cancel a single parcel order', function (done) {
      (0, _supertest2.default)(_index2.default).patch('/api/v1/parcels/' + parcelId + '/cancel').set('Authorization', token).end(function (err, res) {
        if (err) return done(err);
        (0, _chai.expect)(res.statusCode).to.equal(200);
        (0, _chai.expect)(res.body.status).to.equal(200);
        (0, _chai.expect)(res.body).to.be.an('object');
        (0, _chai.expect)(res.body.data).to.be.an('object');
        (0, _chai.expect)(res.body.data.message).to.have.string('Order');
        done();
      });
    });
  });

  describe('#PATCH / parcel', function () {
    it('should throw a 400 error for get a single parcel', function (done) {
      (0, _supertest2.default)(_index2.default).patch('/api/v1/parcels/some/cancel').set('Authorization', token).end(function (err, res) {
        if (err) return done(err);
        (0, _chai.expect)(res.statusCode).to.equal(400);
        (0, _chai.expect)(res.body.status).to.equal(400);
        (0, _chai.expect)(res.body).to.be.an('object');
        (0, _chai.expect)(res.body.error).to.have.string('valid');
        done();
      });
    });
  });
  describe('#PATCH / parcels', function () {
    it('should throw a 401 error for getting a single parcel', function (done) {
      (0, _supertest2.default)(_index2.default).patch('/api/v1/parcels/' + parcelId + '/cancel').set('Authorization', token401).end(function (err, res) {
        if (err) return done(err);
        (0, _chai.expect)(res.statusCode).to.equal(401);
        (0, _chai.expect)(res.body.status).to.equal(401);
        (0, _chai.expect)(res.body).to.be.an('object');
        (0, _chai.expect)(res.body.error).to.have.string('malformed');
        done();
      });
    });
  });

  describe('#PATCH / parcels', function () {
    it('should throw a 403 error for getting a single parcel', function (done) {
      (0, _supertest2.default)(_index2.default).patch('/api/v1/parcels/' + parcelId + '/cancel').end(function (err, res) {
        if (err) return done(err);
        (0, _chai.expect)(res.statusCode).to.equal(403);
        (0, _chai.expect)(res.body.status).to.equal(403);
        (0, _chai.expect)(res.body).to.be.an('object');
        (0, _chai.expect)(res.body.error).to.have.string('provided');
        done();
      });
    });
  });

  // cancel change parcel destination tests
  describe('#PATCH / parcel', function () {
    it('should change the destination of a parcel', function (done) {
      (0, _supertest2.default)(_index2.default).patch('/api/v1/parcels/' + parcelId + '/destination').send(toLocation).set('Authorization', token).end(function (err, res) {
        if (err) return done(err);
        (0, _chai.expect)(res.statusCode).to.equal(200);
        (0, _chai.expect)(res.body.status).to.equal(200);
        (0, _chai.expect)(res.body).to.be.an('object');
        (0, _chai.expect)(res.body.data).to.be.an('object');
        (0, _chai.expect)(res.body.data.message).to.have.string('Order');
        done();
      });
    });
  });

  describe('#PATCH / parcel', function () {
    it('should throw a 400 error for changing a parcel destination parcel', function (done) {
      (0, _supertest2.default)(_index2.default).patch('/api/v1/parcels/some/destination').send(toLocation).set('Authorization', token).end(function (err, res) {
        if (err) return done(err);
        (0, _chai.expect)(res.statusCode).to.equal(400);
        (0, _chai.expect)(res.body.status).to.equal(400);
        (0, _chai.expect)(res.body).to.be.an('object');
        (0, _chai.expect)(res.body.error).to.have.string('valid');
        done();
      });
    });
  });

  describe('#PATCH / parcel', function () {
    it('should throw a 400 error for changing a parcel destination parcel', function (done) {
      (0, _supertest2.default)(_index2.default).patch('/api/v1/parcels/' + parcelId + '/destination').send({ toLocation: 'why' }).set('Authorization', token).end(function (err, res) {
        if (err) return done(err);
        (0, _chai.expect)(res.statusCode).to.equal(400);
        (0, _chai.expect)(res.body.status).to.equal(400);
        (0, _chai.expect)(res.body).to.be.an('object');
        (0, _chai.expect)(res.body.error).to.have.string('valid');
        done();
      });
    });
  });

  describe('#PATCH / parcels', function () {
    it('should throw a 401 error for changing a parcel destination', function (done) {
      (0, _supertest2.default)(_index2.default).patch('/api/v1/parcels/' + parcelId + '/destination').send(toLocation).set('Authorization', token401).end(function (err, res) {
        if (err) return done(err);
        (0, _chai.expect)(res.statusCode).to.equal(401);
        (0, _chai.expect)(res.body.status).to.equal(401);
        (0, _chai.expect)(res.body).to.be.an('object');
        (0, _chai.expect)(res.body.error).to.have.string('malformed');
        done();
      });
    });
  });

  describe('#PATCH / parcels', function () {
    it('should throw a 403 error for getting a single parcel', function (done) {
      (0, _supertest2.default)(_index2.default).patch('/api/v1/parcels/' + parcelId + '/destination').send(toLocation).end(function (err, res) {
        if (err) return done(err);
        (0, _chai.expect)(res.statusCode).to.equal(403);
        (0, _chai.expect)(res.body.status).to.equal(403);
        (0, _chai.expect)(res.body).to.be.an('object');
        (0, _chai.expect)(res.body.error).to.have.string('provided');
        done();
      });
    });
  });

  // cancel change parcel status
  describe('#PATCH / parcel', function () {
    it('should change the status of a parcel', function (done) {
      (0, _supertest2.default)(_index2.default).patch('/api/v1/parcels/' + parcelId + '/status').send(status).set('Authorization', token).end(function (err, res) {
        if (err) return done(err);
        (0, _chai.expect)(res.statusCode).to.equal(200);
        (0, _chai.expect)(res.body.status).to.equal(200);
        (0, _chai.expect)(res.body).to.be.an('object');
        (0, _chai.expect)(res.body.data).to.be.an('object');
        (0, _chai.expect)(res.body.data.message).to.have.string('Order');
        done();
      });
    });
  });

  describe('#PATCH / parcel', function () {
    it('should throw a 400 error for changing a parcel status', function (done) {
      (0, _supertest2.default)(_index2.default).patch('/api/v1/parcels/some/status').send(status).set('Authorization', token).end(function (err, res) {
        if (err) return done(err);
        (0, _chai.expect)(res.statusCode).to.equal(400);
        (0, _chai.expect)(res.body.status).to.equal(400);
        (0, _chai.expect)(res.body).to.be.an('object');
        (0, _chai.expect)(res.body.error).to.have.string('valid');
        done();
      });
    });
  });

  describe('#PATCH / parcel', function () {
    it('should throw a 400 error for changing a parcel status parcel', function (done) {
      (0, _supertest2.default)(_index2.default).patch('/api/v1/parcels/' + parcelId + '/status').send({ status: 'why' }).set('Authorization', token).end(function (err, res) {
        if (err) return done(err);
        (0, _chai.expect)(res.statusCode).to.equal(400);
        (0, _chai.expect)(res.body.status).to.equal(400);
        (0, _chai.expect)(res.body).to.be.an('object');
        (0, _chai.expect)(res.body.error).to.have.string('valid');
        done();
      });
    });
  });
  describe('#PATCH / parcel', function () {
    it('should throw a 500 error for changing a parcel destination parcel', function (done) {
      (0, _supertest2.default)(_index2.default).patch('/api/v1/parcels/' + parcelId + '/destination').send(toLocation).set('Authorization', token).end(function (err, res) {
        if (err) return done(err);
        (0, _chai.expect)(res.statusCode).to.equal(500);
        (0, _chai.expect)(res.body.status).to.equal(500);
        (0, _chai.expect)(res.body).to.be.an('object');
        (0, _chai.expect)(res.body.error).to.have.string('authorized');
        done();
      });
    });
  });
  describe('#PATCH / parcel', function () {
    it('should throw a 500 error for cancelling a parcel order', function (done) {
      (0, _supertest2.default)(_index2.default).patch('/api/v1/parcels/' + parcelId + '/cancel').set('Authorization', token).end(function (err, res) {
        if (err) return done(err);
        (0, _chai.expect)(res.statusCode).to.equal(500);
        (0, _chai.expect)(res.body.status).to.equal(500);
        (0, _chai.expect)(res.body).to.be.an('object');
        (0, _chai.expect)(res.body.error).to.have.string('authorized');
        done();
      });
    });
  });
  describe('#PATCH / parcels', function () {
    it('should throw a 401 error for changing a parcel status', function (done) {
      (0, _supertest2.default)(_index2.default).patch('/api/v1/parcels/' + parcelId + '/status').send(status).set('Authorization', token401).end(function (err, res) {
        if (err) return done(err);
        (0, _chai.expect)(res.statusCode).to.equal(401);
        (0, _chai.expect)(res.body.status).to.equal(401);
        (0, _chai.expect)(res.body).to.be.an('object');
        (0, _chai.expect)(res.body.error).to.have.string('malformed');
        done();
      });
    });
  });

  describe('#PATCH / parcels', function () {
    it('should throw a 403 error for changing a single partcel status', function (done) {
      (0, _supertest2.default)(_index2.default).patch('/api/v1/parcels/' + parcelId + '/status').send(status).end(function (err, res) {
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