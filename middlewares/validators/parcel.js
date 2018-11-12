
import Transformer from '../../utils/transformer';

const Validator = {};

Validator.create = (req, res, next) => {
  req.checkBody('parcel.placedBy', 'Please enter a valid placer id').notEmpty().isDecimal();
  req.checkBody('parcel.weight', 'Please supply a valid weight').notEmpty().isDecimal();
  req.checkBody('parcel.weightmetric', 'Please supply a valid weightmetric').notEmpty().isMinLen(2).isMaxLen(10);
  req.checkBody('parcel.sentOn', 'Please supply a valid date in format yyyy-mm-dd').notEmpty().isDateV2();
  req.checkBody('parcel.status', 'Please supply a valid status').notEmpty().isStatusType();
  req.checkBody('parcel.fromLocation', 'please supply a valid address').notEmpty().isMinLen(6).isMaxLen(100);
  req.checkBody('parcel.toLocation', 'Please supply a valid address').isMinLen(6).isMaxLen(100);
  req.asyncValidationErrors()
    .then(next)
    .catch(errors => res.status(400).json(Transformer.transformResponse(0,
      Transformer.transformExpressValidationErrors(errors), errors)));
};

export default Validator;
