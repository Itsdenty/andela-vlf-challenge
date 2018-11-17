'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var CustomValidators = {},
    statuses = ['placed', 'transiting', 'delivered', 'cancelled'];

CustomValidators.isMinLen = function (input, val) {
  return input.length >= val;
};

CustomValidators.isMaxLen = function (input, val) {
  return input.length <= val;
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

CustomValidators.isArray = function (input) {
  return Array.isArray(input);
};
CustomValidators.isStatusType = function (input) {
  return statuses.includes(input.toLowerCase());
};
CustomValidators.isIdType = function (input) {
  return input + 1 > 0;
};
exports.default = CustomValidators;