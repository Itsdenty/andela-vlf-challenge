'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var CustomValidators = {};

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

CustomValidators.isOccupation = function (input) {
  if (input.length < 2 || input.length > 50) {
    return false;
  }

  return (/[a-zA-Z\d\s]/.test(input)
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

CustomValidators.isHumanTitle = function (input) {
  try {
    input = input.toString().toUpperCase();
  } catch (e) {
    return false;
  }

  return ['MR', 'MRS', 'MISS'].includes(input);
};

CustomValidators.isMemberPosition = function (input) {
  try {
    input = input.toString().toUpperCase();
  } catch (e) {
    return false;
  }

  return ['PRESIDENT', 'VICE-PRESIDENT', 'SECRETARY', 'TREASURER', 'MEMBER'].includes(input);
};

CustomValidators.isEmployeeRole = function (input) {
  try {
    input = input.toString().toUpperCase();
  } catch (e) {
    return false;
  }

  return ['COMPANY-ADMIN', 'STAFF-ADMIN', 'FINANCE-ADMIN', 'STAFF'].includes(input);
};

CustomValidators.isBankAccountType = function (input) {
  try {
    input = input.toString().toUpperCase();
  } catch (e) {
    return false;
  }

  return ['SAVINGS', 'CURRENT', 'FIXED-DEPOSIT'].includes(input);
};

CustomValidators.isBankAccountNumber = function (input) {
  return (/\d{10}/.test(input)
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

exports.default = CustomValidators;