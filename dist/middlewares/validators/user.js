'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _transformer = require('../../utils/transformer');

var _transformer2 = _interopRequireDefault(_transformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Validator = {};

Validator.create = function (req, res, next) {
  req.checkBody('user.firstName', 'Please enter a valid firstName').notEmpty().isHumanName();
  req.checkBody('user.lastName', 'Please supply a valid lastName').notEmpty().isHumanName();
  req.checkBody('user.otherNames', 'Please supply valid otherNames').notEmpty().isHumanName();
  req.checkBody('user.username', 'Please supply a valid username').notEmpty().isHumanName();
  req.checkBody('user.lastName', 'Please supply a valid lastName').notEmpty().isHumanName();
  req.checkBody('user.email', 'please supply a valid email').notEmpty().isEmailV2();
  req.checkBody('user.password', 'Please supply a valid password').isMinLen(6).isMaxLen(50);
  req.asyncValidationErrors().then(next).catch(function (errors) {
    return res.status(400).json(_transformer2.default.transformResponse(0, _transformer2.default.transformExpressValidationErrors(errors), errors));
  });
};

Validator.login = function (req, res, next) {
  req.checkBody('login.email', 'please supply a valid email').notEmpty().isEmailV2();
  req.checkBody('login.password', 'Please supply a valid password').isMinLen(6).isMaxLen(50);
  req.asyncValidationErrors().then(next).catch(function (errors) {
    return res.status(400).json(_transformer2.default.transformResponse(0, _transformer2.default.transformExpressValidationErrors(errors), errors));
  });
};
exports.default = Validator;