'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _transformer = require('../../utils/transformer');

var _transformer2 = _interopRequireDefault(_transformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Validator = {};

Validator.create = function (req, res, next) {
  req.checkBody('parcel.placedBy', 'Please enter a valid placer id').notEmpty().isDecimal();
  req.checkBody('parcel.weight', 'Please supply a valid weight').notEmpty().isDecimal();
  req.checkBody('parcel.weightmetric', 'Please supply a valid weightmetric').notEmpty().isMinLen(2).isMaxLen(10);
  req.checkBody('parcel.fromLocation', 'please supply a valid address').notEmpty().isMinLen(6).isMaxLen(100);
  req.checkBody('parcel.toLocation', 'Please supply a valid address').notEmpty().isMinLen(6).isMaxLen(100);
  req.asyncValidationErrors().then(next).catch(function (errors) {
    return res.status(400).json(_transformer2.default.transformResponse(400, _transformer2.default.transformExpressValidationErrors(errors), errors));
  });
};
Validator.validateId = function (req, res, next) {
  req.checkParams('id', 'Please enter a valid parcel id').notEmpty().isDecimal();
  req.asyncValidationErrors().then(next).catch(function (errors) {
    return res.status(400).json(_transformer2.default.transformResponse(400, _transformer2.default.transformExpressValidationErrors(errors), errors));
  });
};

Validator.validateAddress = function (req, res, next) {
  req.checkParams('id', 'Please enter a valid parcel id').notEmpty().isDecimal();
  req.checkBody('toLocation', 'Please supply a valid destination address').notEmpty().isMinLen(6).isMaxLen(100);
  req.asyncValidationErrors().then(next).catch(function (errors) {
    return res.status(400).json(_transformer2.default.transformResponse(400, _transformer2.default.transformExpressValidationErrors(errors), errors));
  });
};

Validator.validateStatus = function (req, res, next) {
  req.checkParams('id', 'Please enter a valid parcel id').notEmpty().isDecimal();
  req.checkBody('status', 'Please supply a valid parcel status').notEmpty().isStatusType();
  req.asyncValidationErrors().then(next).catch(function (errors) {
    return res.status(400).json(_transformer2.default.transformResponse(400, _transformer2.default.transformExpressValidationErrors(errors), errors));
  });
};
exports.default = Validator;