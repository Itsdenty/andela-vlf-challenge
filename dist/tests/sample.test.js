'use strict';

var _chai = require('chai');

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('test the default api endpoint', function () {

  describe('#GET / vi route', function () {
    it('should test the v1 route', function (done) {
      (0, _supertest2.default)(_index2.default).get('/api/v1/').end(function (err, res) {
        if (err) return done(err);
        (0, _chai.expect)(res.statusCode).to.equal(200);
        (0, _chai.expect)(res.body.msg).to.equal('welcome');
        done();
      });
    });
  });
});