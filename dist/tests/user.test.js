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
function generateDummyName() {
  var xterBank = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var fstring = '';
  for (var i = 0; i < 7; i += 1) {
    fstring += xterBank[parseInt(Math.random() * 52, 10)];
  }
  return fstring;
}

var emailFrag1 = generateDummyName(),
    emailFrag2 = emailFrag1.substring(0, 4),
    email = emailFrag1 + '@' + emailFrag2 + '.com';

describe('User API endpoints intgeration Tests', function () {
  var user = {
    user: {
      firstName: 'test-firstname',
      lastName: 'test-lastname',
      otherNames: 'test-othername',
      username: 'test-' + emailFrag1,
      password: 'password1234',
      isAdmin: false,
      email: email
    }
  };
  var user400 = {
    user: {
      firstName: 1234,
      lastName: 'te',
      otherNames: 'te',
      username: 'test-' + emailFrag1,
      password: 'password1234',
      isAdmin: false,
      email: email
    }
  };
  var login = {
    login: {
      email: email,
      password: 'password1234'
    }
  };

  var login400 = {
    login: {
      email: email,
      password: 123
    }
  };

  var login500 = {
    login: {
      email: 'dent4real@gmail.com',
      password: 'password1234'
    }
  };

  var login502 = {
    login: {
      email: email,
      password: 'cool-password'
    }
  };

  describe('#POST / user', function () {
    it('should create a single user', function (done) {
      (0, _supertest2.default)(_index2.default).post('/api/v1/auth/signup').send(user).end(function (err, res) {
        if (err) return done(err);
        (0, _chai.expect)(res.statusCode).to.equal(200);
        (0, _chai.expect)(res.body).to.be.an('object');
        (0, _chai.expect)(res.body.data).to.be.an('object');
        (0, _chai.expect)(res.body.status).to.equal(200);
        done();
      });
    });
  });

  describe('#POST / user', function () {
    it('should throw a user creation error', function (done) {
      (0, _supertest2.default)(_index2.default).post('/api/v1/auth/signup').send(user).end(function (err, res) {
        if (err) return done(err);
        (0, _chai.expect)(res.statusCode).to.equal(500);
        (0, _chai.expect)(res.body).to.be.an('object');
        (0, _chai.expect)(res.body.error).to.have.string('occured');
        (0, _chai.expect)(res.body.status).to.equal(500);
        done();
      });
    });
  });

  describe('#POST / user', function () {
    it('should throw a validation error during user creation', function (done) {
      (0, _supertest2.default)(_index2.default).post('/api/v1/auth/signup').send(user400).end(function (err, res) {
        if (err) return done(err);
        (0, _chai.expect)(res.statusCode).to.equal(400);
        (0, _chai.expect)(res.body).to.be.an('object');
        (0, _chai.expect)(res.body.error).to.have.string('valid');
        (0, _chai.expect)(res.body.status).to.equal(400);
        done();
      });
    });
  });

  describe('#POST / user login', function () {
    it('should login a user', function (done) {
      (0, _supertest2.default)(_index2.default).post('/api/v1/auth/login').send(login).end(function (err, res) {
        if (err) return done(err);
        (0, _chai.expect)(res.statusCode).to.equal(200);
        (0, _chai.expect)(res.body).to.be.an('object');
        (0, _chai.expect)(res.body.data).to.be.an('object');
        (0, _chai.expect)(res.body.status).to.equal(200);
        user.user = res.body.payload;
        done();
      });
    });
  });

  describe('#POST / user login', function () {
    it('should throw login 400 error a user', function (done) {
      (0, _supertest2.default)(_index2.default).post('/api/v1/auth/login').send(login400).end(function (err, res) {
        if (err) return done(err);
        (0, _chai.expect)(res.statusCode).to.equal(400);
        (0, _chai.expect)(res.body).to.be.an('object');
        (0, _chai.expect)(res.body.error).to.have.string('valid');
        (0, _chai.expect)(res.body.status).to.equal(400);
        user.user = res.body.payload;
        done();
      });
    });
  });

  describe('#POST / user login', function () {
    it('should throw login 500 error a user', function (done) {
      (0, _supertest2.default)(_index2.default).post('/api/v1/auth/login').send(login500).end(function (err, res) {
        if (err) return done(err);
        (0, _chai.expect)(res.statusCode).to.equal(500);
        (0, _chai.expect)(res.body).to.be.an('object');
        (0, _chai.expect)(res.body.error).to.have.string('wrong');
        (0, _chai.expect)(res.body.status).to.equal(500);
        user.user = res.body.payload;
        done();
      });
    });
  });

  describe('#POST / user login', function () {
    it('should throw login 500 error a user', function (done) {
      (0, _supertest2.default)(_index2.default).post('/api/v1/auth/login').send(login502).end(function (err, res) {
        if (err) return done(err);
        (0, _chai.expect)(res.statusCode).to.equal(500);
        (0, _chai.expect)(res.body).to.be.an('object');
        (0, _chai.expect)(res.body.error).to.have.string('wrong');
        (0, _chai.expect)(res.body.status).to.equal(500);
        user.user = res.body.payload;
        done();
      });
    });
  });
});