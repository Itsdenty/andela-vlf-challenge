import { expect } from 'chai';
import request from 'supertest';
import app from '../index';

/**
 *
 *
 * @returns {String} fstring
 */
function generateDummyName() {
  const xterBank = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let fstring = '';
  for (let i = 0; i < 7; i += 1) {
    fstring += xterBank[parseInt(Math.random() * 52, 10)];
  }
  return fstring;
}


const
  emailFrag1 = generateDummyName(),
  emailFrag2 = emailFrag1.substring(0, 4),
  email = `${emailFrag1}@${emailFrag2}.com`;


describe('User API endpoints intgeration Tests', () => {
  const user = {
    user: {
      firstName: 'test-firstname',
      lastName: 'test-lastname',
      otherNames: 'test-othername',
      username: `test-${emailFrag1}`,
      password: 'password1234',
      isAdmin: false,
      email,
    }
  };

  const login = {
    login: {
      email,
      password: 'password1234',
    }
  };

  describe('#POST / user', () => {
    it('should create a single user', (done) => {
      request(app).post('/api/v1/auth/signup').send(user)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.data).to.be.an('object');
          expect(res.body.status).to.equal(200);
          user.user = res.body.data.user;
          done();
        });
    });
  });
  describe('#POST / user login', () => {
    it('should login a user', (done) => {
      request(app).post('/api/v1/auth/login').send(login)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.data).to.be.an('object');
          expect(res.body.status).to.equal(200);
          user.user = res.body.payload;
          done();
        });
    });
  });
});
