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

  describe('#GET / vi route', () => {
    it('should test the swagger route', (done) => {
      request(app).get('/api/v1/swagger.json')
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('object');
          done();
        });
    });
  });

  describe('#GET / vi route', () => {
    it('should test the swagger route', (done) => {
      request(app).get('/api')
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).to.equal(200);
          expect(res.text).to.have.string('api');
          done();
        });
    });
  });

  describe('#GET / vi route', () => {
    it('should test the swagger route', (done) => {
      request(app).get('/')
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).to.equal(200);
          expect(res.text).to.have.string('index');
          done();
        });
    });
  });

  describe('#GET / vi route', () => {
    it('should test the 404 fallback route', (done) => {
      request(app).get('/cool')
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).to.equal(404);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.have.string('wrong route');
          done();
        });
    });
  });
});
