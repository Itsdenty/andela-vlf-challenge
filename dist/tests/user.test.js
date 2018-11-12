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

  var login = {
    login: {
      email: email,
      password: 'password1234'
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
        user.user = res.body.data.user;
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
});