'use strict';

import {expect} from 'chai';
import request from 'supertest';
import app from '../index'


describe('test the default api endpoint', function() {

  describe('#GET / vi route', function () {
    it('should test the v1 route', function (done) {
      request(app).get('/api/v1/')
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.statusCode).to.equal(200);
          expect(res.body.msg).to.equal('welcome');
          done();
        })
    })
  });
});