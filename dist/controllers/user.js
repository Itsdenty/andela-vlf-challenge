'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _transformer = require('../utils/transformer');

var _transformer2 = _interopRequireDefault(_transformer);

var _user = require('../processors/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *
 *
 * @class userController
 */
var userController = function () {
  function userController() {
    _classCallCheck(this, userController);
  }

  _createClass(userController, null, [{
    key: 'createUser',

    /**
     *
     *
     * @static
     * @param {*} req
     * @param {*} res
     * @memberof userController
     * @returns {json} createUser response
     */
    value: async function createUser(req, res) {
      var hashPassword = _bcrypt2.default.hashSync(req.body.user.password, 10);
      var email = req.body.user.email.trim().toLowerCase();
      req.body.user.email = email;
      req.body.user.password = hashPassword;
      try {
        var createUser = await _user2.default.createUser(req.body.user);
        res.send(_transformer2.default.transformResponse(200, createUser));
      } catch (error) {
        res.status(500).json(_transformer2.default.transformResponse(500, error.error));
      }
    }

    /**
     *
     *
     * @static
     * @param {*} req
     * @param {*} res
     * @memberof userController
     * @returns {*} loginUser
     */

  }, {
    key: 'userLogin',
    value: async function userLogin(req, res) {
      try {
        var loginUser = await _user2.default.loginUser(req);
        res.send(_transformer2.default.transformResponse(200, loginUser));
      } catch (error) {
        res.status(500).json(_transformer2.default.transformResponse(500, error.error));
      }
    }
  }]);

  return userController;
}();

exports.default = userController;