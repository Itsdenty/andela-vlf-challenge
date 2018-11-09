import { expect } from 'chai';
import request from 'supertest';
import app from '../index';


describe('test the default api endpoint', () => {
  describe('#GET / vi route', () => {
    it('should test the v1 route', (done) => {
      request(app).get('/api/v1/')
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).to.equal(200);
          done();
        });
    });
  });
});
