import { expect } from 'chai';
import request from 'supertest';
import app from '../index';

/**
 *
 *
 * @returns {String} fstring
 */

describe('User API endpoints intgeration Tests', () => {
  const parcel = {
    parcel: {
      placedBy: 1,
      weight: 3,
      weightmetric: 'kg',
      fromLocation: 'test to location',
      toLocation: 'test from location'
    }
  };

  const parcel400 = {
    parcel: {
      placedBy: 1,
      weight: 'awesome',
      weightmetric: 'kg',
      fromLocation: 'test to location',
      toLocation: 'test from location'
    }
  };

  const parcel500 = {
    parcel: {
      placedBy: 0,
      weight: 3,
      weightmetric: 'kg',
      fromLocation: 'test to location',
      toLocation: 'test from location'
    }
  };
  let token = '';

  const login = {
    login: {
      email: 'coding-muse@gmail.com',
      password: 'ispassword'
    }
  };
  const token401 = 'awesome-token-for-us';
  
  describe('#POST / user login', () => {
    it('should login a user', (done) => {
      request(app).post('/api/v1/auth/login').send(login)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.data).to.be.an('object');
          expect(res.body.status).to.equal(200);
          token = `Bearer ${res.body.data.token}`;
          done();
        });
    });
  });
  describe('#POST / parcels', () => {
    it('should create a parcel order', (done) => {
      request(app).post('/api/v1/parcels').send(parcel)
        .set('Authorization', token)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.data).to.be.an('object');
          parcel.parcel = res.body.data.parcel;
          done();
        });
    });
  });

  describe('#POST / parcels', () => {
    it('should throw a 400 error for a parcel order', (done) => {
      request(app).post('/api/v1/parcels').send(parcel400)
        .set('Authorization', token)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).to.equal(400);
          expect(res.body.status).to.equal(400);
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.have.string('valid');
          done();
        });
    });
  });

  describe('#POST / parcels', () => {
    it('should throw a 500 error for a parcel order', (done) => {
      request(app).post('/api/v1/parcels').send(parcel500)
        .set('Authorization', token)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal(500);
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.have.string('occured');
          done();
        });
    });
  });

  describe('#POST / parcels', () => {
    it('should throw a 401 error for a parcel order', (done) => {
      request(app).post('/api/v1/parcels').send(parcel)
        .set('Authorization', token401)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).to.equal(401);
          expect(res.body.status).to.equal(401);
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.have.string('malformed');
          done();
        });
    });
  });

  describe('#POST / parcels', () => {
    it('should throw a 500 error for a parcel order', (done) => {
      request(app).post('/api/v1/parcels').send(parcel500)
        .set('Authorization', token)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal(500);
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.have.string('occured');
          done();
        });
    });
  });
  
  describe('#POST / parcels', () => {
    it('should throw a 403 error for a parcel order', (done) => {
      request(app).post('/api/v1/parcels').send(parcel)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).to.equal(403);
          expect(res.body.status).to.equal(403);
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.have.string('provided');
          done();
        });
    });
  });
});
