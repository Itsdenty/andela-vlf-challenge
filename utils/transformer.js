const transformer = {};

transformer.transformResponse = (status, data) => {
  if (!data) {
    data = {};
  }
  if (status === 0) {
    return {
      status,
      error: data
    };
  }
  return {
    status,
    data
  };
};

/**
 *
 * @param {Array} errors
 * @returns {string}
 * @description transforms errors generated by express validator to a single message string
 * with each message separated by '|'
 * @returns {json} transformed validation error
 */
transformer.transformExpressValidationErrors = (errors) => {
  let msgs = '';

  if (!Array.isArray(errors)) return msgs;

  errors.forEach((item) => {
    msgs += ` ${(item.msg || '')} |`;
  });

  return msgs;
};

export default transformer;
