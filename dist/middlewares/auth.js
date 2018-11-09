'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _transformer = require('../utils/transformer');

var _transformer2 = _interopRequireDefault(_transformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var JWT = {};

JWT.verifyToken = function (req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.Authorization || req.headers.authorization;
  token = token ? token.substring(7) : token;
  if (!token) {
    return res.status(403).json(_transformer2.default.transformResponse(0, 'No token provided'));
  }

  _jsonwebtoken2.default.verify(token, process.env.JWT_SECRET, function (error, decoded) {
    if (error) {
      return res.status(401).json(_transformer2.default.transformResponse(0, error.message));
    }
    req.decodedToken = decoded;
    next();
  });
};

exports.default = JWT;