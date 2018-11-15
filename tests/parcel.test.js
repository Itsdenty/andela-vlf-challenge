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

  // create parcel tests
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

  // get a single parcel tests
  describe('#GET / parcel', () => {
    it('should get a single parcel order', (done) => {
      request(app).get('/api/v1/parcels/1')
        .set('Authorization', token)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.data).to.be.an('object');
          expect(res.body.data.fromlocation).to.have.string('l');
          done();
        });
    });
  });

  describe('#GET / parcel', () => {
    it('should throw a 400 error for get a single parcel', (done) => {
      request(app).get('/api/v1/parcels/some')
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
  describe('#GET / parcels', () => {
    it('should throw a 401 error for getting a single parcel', (done) => {
      request(app).get('/api/v1/parcels/1')
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

  describe('#GET / parcels', () => {
    it('should throw a 403 error for getting a single parcel', (done) => {
      request(app).get('/api/v1/parcels/1')
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

  // get all parcels tests
  describe('#GET / parcels', () => {
    it('should get al parcels order', (done) => {
      request(app).get('/api/v1/parcels')
        .set('Authorization', token)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.data[0]).to.be.an('object');
          expect(res.body.data[0].fromlocation).to.have.string('test');
          done();
        });
    });
  });

  describe('#GET / parcels', () => {
    it('should throw a 401 error for a parcel order', (done) => {
      request(app).get('/api/v1/parcels')
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

  describe('#GET / parcels', () => {
    it('should throw a 403 error for a parcel order', (done) => {
      request(app).get('/api/v1/parcels')
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

  // cancel a single parcel tests
  describe('#PATCH / parcel', () => {
    it('should cancel a single parcel order', (done) => {
      request(app).patch('/api/v1/parcels/1/cancel')
        .set('Authorization', token)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.data).to.be.an('object');
          expect(res.body.data.message).to.have.string('Order');
          done();
        });
    });
  });

  describe('#PATCH / parcel', () => {
    it('should throw a 400 error for get a single parcel', (done) => {
      request(app).patch('/api/v1/parcels/some/cancel')
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
  describe('#PATCH / parcels', () => {
    it('should throw a 401 error for getting a single parcel', (done) => {
      request(app).patch('/api/v1/parcels/1/cancel')
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

  describe('#PATCH / parcels', () => {
    it('should throw a 403 error for getting a single parcel', (done) => {
      request(app).patch('/api/v1/parcels/1/cancel')
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
