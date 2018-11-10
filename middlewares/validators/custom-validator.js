const CustomValidators = {};

CustomValidators.isEqual = (input, val) => {
  if (!input) {
    return false;
  }

  return val === input;
};

CustomValidators.isLengthEqual = (input, val) => {
  if (!input) {
    return false;
  }

  return input.length === val;
};

CustomValidators.isMinLen = (input, val) => {
  if (!input) {
    return false;
  }

  return input.length >= val;
};

CustomValidators.isMaxLen = (input, val) => {
  if (!input) {
    return false;
  }

  return input.length <= val;
};

CustomValidators.isGender = (input) => {
  try {
    input = input.toString().toUpperCase();
  } catch (e) {
    return false;
  }

  return ['MALE', 'FEMALE'].includes(input);
};

CustomValidators.isHouseAddress = (input) => {
  if (typeof input !== 'string') {
    return false;
  }

  if (input.length < 2 || input.length > 100) {
    return false;
  }

  return /^([a-zA-Z#,.\d\s])*$/.test(input);
};

CustomValidators.isBVN = input => /^(2)([0-9]{10})$/.test(input);


CustomValidators.isNigerianMobile = input => /^(0)*(\d{10})$/.test(input);


CustomValidators.isHumanName = (input) => {
  if (typeof input !== 'string') {
    return false;
  }

  if (input.length < 2 || input.length > 50) {
    return false;
  }
  return /^([a-zA-Z,.\d\s\-])*$/.test(input);
};

CustomValidators.isEmailV2 = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

CustomValidators.isCustomInt = input => Number.isInteger(input);

CustomValidators.isArray = input => Array.isArray(input);

export default CustomValidators;
