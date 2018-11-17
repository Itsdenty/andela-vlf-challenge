import express from 'express';
import controller from '../../../controllers/parcel';
import validator from '../../../middlewares/validators/parcel';
import jwtVerify from '../../../middlewares/auth';


const router = express.Router();
router.post('/', jwtVerify.verifyToken, validator.create, controller.createParcel);
router.get('/', jwtVerify.verifyToken, controller.getAllParcels);
router.get('/:id', jwtVerify.verifyToken, validator.validadteId, controller.getOneParcel);
router.patch('/:id/cancel', jwtVerify.verifyToken, validator.validadteId,
  controller.cancelParcelOrder);
router.patch('/:id/destination', jwtVerify.verifyToken,
  validator.changeDestination, controller.changeParcelDestination);
router.patch('/:id/status', jwtVerify.verifyToken,
  validator.validateStatus, controller.changeParcelDestination);
export default router;
