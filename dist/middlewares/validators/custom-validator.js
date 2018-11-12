'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CustomValidators = {},
    statuses = ['placed', 'transiting', 'delivered', 'cancelled'];

CustomValidators.isEqual = function (input, val) {
  if (!input) {
    return false;
  }

  return val === input;
};

CustomValidators.isLengthEqual = function (input, val) {
  if (!input) {
    return false;
  }

  return input.length === val;
};

CustomValidators.isDateV2 = function (input) {
  return (0, _moment2.default)(input, 'YYYY-MM-DD', true).isValid();
};

CustomValidators.isMinLen = function (input, val) {
  if (!input) {
    return false;
  }

  return input.length >= val;
};

CustomValidators.isMaxLen = function (input, val) {
  if (!input) {
    return false;
  }

  return input.length <= val;
};

CustomValidators.isGender = function (input) {
  try {
    input = input.toString().toUpperCase();
  } catch (e) {
    return false;
  }

  return ['MALE', 'FEMALE'].includes(input);
};

CustomValidators.isHouseAddress = function (input) {
  if (typeof input !== 'string') {
    return false;
  }

  if (input.length < 2 || input.length > 100) {
    return false;
  }

  return (/^([a-zA-Z#,.\d\s])*$/.test(input)
  );
};

CustomValidators.isBVN = function (input) {
  return (/^(2)([0-9]{10})$/.test(input)
  );
};

CustomValidators.isNigerianMobile = function (input) {
  return (/^(0)*(\d{10})$/.test(input)
  );
};

CustomValidators.isHumanName = function (input) {
  if (typeof input !== 'string') {
    return false;
  }

  if (input.length < 2 || input.length > 50) {
    return false;
  }
  return (/^([a-zA-Z,.\d\s\-])*$/.test(input)
  );
};

CustomValidators.isEmailV2 = function (email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

CustomValidators.isCustomInt = function (input) {
  return Number.isInteger(input);
};

CustomValidators.isArray = function (input) {
  return Array.isArray(input);
};
CustomValidators.isStatusType = function (input) {
  return statuses.includes(input);
};

exports.default = CustomValidators;