'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _pg = require('pg');

var _createToken = require('../utils/createToken');

var _createToken2 = _interopRequireDefault(_createToken);

var _postgresConfig = require('../config/postgres-config');

var _postgresConfig2 = _interopRequireDefault(_postgresConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var clientPool = new _pg.Pool(_postgresConfig2.default);

var secretKey = process.env.JWT_SECRET;

/**
 * @description - Describes the Users of the app, their creation, their editing e.t.c.
 */

var userProcessor = function () {
  function userProcessor() {
    _classCallCheck(this, userProcessor);
  }

  _createClass(userProcessor, null, [{
    key: 'createUser',

    /**
     * @description - Creates a new user in the app and assigns a token to them
     * @param{Object} req - api request
     * @param{Object} res - route response
     * @return{json} the registered user's detail
     */
    value: async function createUser(req) {
      // Hash password to save in the database
      var createUser = 'INSERT INTO aUsers (firstName, lastName, phoneNo, username, email, password)\n                            VALUES ($1, $2, $3, $4, $5, $6)\n                            RETURNING *';
      try {
        var client = await clientPool.connect();

        var values = [req.body.firstName, req.body.lastName, req.body.phoneNo, req.body.username, req.body.email, req.body.password];

        var createdUser = await client.query({ text: createUser, values: values });

        var signedupUser = createdUser.rows[0];

        var _createdUser$rows$ = createdUser.rows[0],
            userId = _createdUser$rows$.userId,
            firstName = _createdUser$rows$.firstName,
            lastName = _createdUser$rows$.lastName;

        // create the token after all the inputs are certified ok

        var authToken = _createToken2.default.token({ userId: userId, firstName: firstName, lastName: lastName }, secretKey);
        client.release();
        return {
          message: 'User created successfully',
          user: signedupUser,
          token: authToken
        };
      } catch (error) {
        return {
          message: 'Check your input and try again pls, you might be entering a wrong input'
        };
      }
    }

    /**
     * @description - Signs a user in by creating a session token
     * @param{Object} req - api request
     * @param{Object} res - route response
     * @return{json} the user's login status
     */

  }, {
    key: 'loginUser',
    value: async function loginUser(req) {
      var email = req.body.email.trim().toLowerCase();
      var findOneUser = 'SELECT * FROM aUsers\n                          WHERE email = $1';
      // checks if a token was passed into the request header
      if (req.headers.authorization) {
        try {
          var token = req.headers.authorization.split(' ')[1];
          var decoded = _jsonwebtoken2.default.verify(token, secretKey);
          req.userData = decoded.userid;
          if (req.userData !== null) {
            return { message: 'You are already logged in' };
          }
        } catch (error) {
          return { message: 'Token is invalid or has expired, Please re-login' };
        }
      }
      try {
        var client = await clientPool.connect();
        // find a user with the given email
        var user = await client.query({ text: findOneUser, values: [email] });
        if (user.rows[0]) {
          var signedInUser = user.rows[0];
          // check it the password matches
          var correctPassword = await _bcrypt2.default.compare(req.body.password, user.rows[0].password);
          if (!correctPassword) {
            return { message: 'wrong password!' };
          }
          // creates a token that lasts for 24 hours
          var _user$rows$ = user.rows[0],
              userid = _user$rows$.userid,
              firstname = _user$rows$.firstname,
              lastname = _user$rows$.lastname;

          var authToken = _createToken2.default.token({ userid: userid, firstname: firstname, lastname: lastname }, secretKey);
          return {
            message: 'You are logged in!',
            token: authToken,
            user: signedInUser
          };
        }
      } catch (error) {
        return { message: 'An error occured' };
      }
    }
  }]);

  return userProcessor;
}();

exports.default = userProcessor;