
import Transformer from '../../utils/transformer';

const Validator = {};

Validator.create = (req, res, next) => {
  req.checkBody('parcel.placedBy', 'Please enter a valid placer id').notEmpty().isDecimal();
  req.checkBody('parcel.weight', 'Please supply a valid weight').notEmpty().isDecimal();
  req.checkBody('parcel.weightmetric', 'Please supply a valid weightmetric').notEmpty().isMinLen(2).isMaxLen(10);
  req.checkBody('parcel.fromLocation', 'please supply a valid address').notEmpty().isMinLen(6).isMaxLen(100);
  req.checkBody('parcel.toLocation', 'Please supply a valid address').notEmpty().isMinLen(6).isMaxLen(100);
  req.asyncValidationErrors()
    .then(next)
    .catch(errors => res.status(400).json(Transformer.transformResponse(400,
      Transformer.transformExpressValidationErrors(errors), errors)));
};
Validator.getOne = (req, res, next) => {
  req.checkParams('id', 'Please enter a valid parcel id').notEmpty().isDecimal();
  req.asyncValidationErrors()
    .then(next)
    .catch(errors => res.status(400).json(Transformer.transformResponse(400,
      Transformer.transformExpressValidationErrors(errors), errors)));
};

Validator.changeDestination = (req, res, next) => {
  req.checkParams('id', 'Please enter a valid parcel id').notEmpty().isDecimal();
  req.checkBody('parcel.toLocation', 'Please supply a valid destination address').notEmpty().isMinLen(6).isMaxLen(100);
  req.asyncValidationErrors()
    .then(next)
    .catch(errors => res.status(400).json(Transformer.transformResponse(400,
      Transformer.transformExpressValidationErrors(errors), errors)));
};
export default Validator;
