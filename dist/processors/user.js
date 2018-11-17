'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _pg = require('pg');

var _createToken = require('../utils/createToken');

var _createToken2 = _interopRequireDefault(_createToken);

var _postgresConfig = require('../config/postgres-config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var clientPool = new _pg.Pool(_postgresConfig.connectionString),
    secretKey = process.env.JWT_SECRET;

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
     * @param{Object} user - api request
     * @param{Object} res - route response
     * @return{json} the registered user's detail
     */
    value: async function createUser(user) {
      // Hash password to save in the database
      var createUser = 'INSERT INTO aUsers (firstName, lastName, otherNames, username, email, password, isAdmin)\n                            VALUES ($1, $2, $3, $4, $5, $6, $7)\n                            RETURNING *';
      try {
        var client = await clientPool.connect();

        var values = [user.firstName, user.lastName, user.otherNames, user.username, user.email, user.password, user.isAdmin];

        var createdUser = await client.query({ text: createUser, values: values });

        var signedupUser = createdUser.rows[0];
        delete signedupUser.password;
        var _createdUser$rows$ = createdUser.rows[0],
            id = _createdUser$rows$.id,
            firstName = _createdUser$rows$.firstName,
            lastName = _createdUser$rows$.lastName,
            isadmin = _createdUser$rows$.isadmin;

        // create the token after all the inputs are certified ok

        var authToken = _createToken2.default.token({
          id: id, firstName: firstName, lastName: lastName, isadmin: isadmin
        }, secretKey);
        client.release();
        return {
          message: 'User created successfully',
          user: signedupUser,
          token: authToken
        };
      } catch (error) {
        var err = { error: 'and error occured or user already exists' };
        throw err;
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
      var email = req.body.login.email.trim().toLowerCase();
      var findOneUser = 'SELECT * FROM aUsers\n                          WHERE email = $1';
      try {
        var client = await clientPool.connect();
        // find a user with the given email
        var user = await client.query({ text: findOneUser, values: [email] });
        if (user.rows[0].id) {
          var signedInUser = user.rows[0];
          // check it the password matches
          var password = await _bcrypt2.default.compare(req.body.login.password, user.rows[0].password);
          if (!password) {
            // return { message: 'wrong password!' };
            throw new Error('wrong password!');
          }
          // creates a token that lasts for 24 hours
          var _user$rows$ = user.rows[0],
              id = _user$rows$.id,
              firstname = _user$rows$.firstname,
              lastname = _user$rows$.lastname,
              isadmin = _user$rows$.isadmin;

          delete signedInUser.password;
          var authToken = _createToken2.default.token({
            id: id, firstname: firstname, lastname: lastname, isadmin: isadmin
          }, secretKey);
          return {
            message: 'You are logged in!',
            token: authToken,
            user: signedInUser
          };
        }
        throw new Error('user not found');
      } catch (error) {
        var err = { error: 'wrong username or password' };
        throw err;
      }
    }
  }]);

  return userProcessor;
}();

exports.default = userProcessor;