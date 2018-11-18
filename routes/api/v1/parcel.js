import express from 'express';
import controller from '../../../controllers/parcel';
import validator from '../../../middlewares/validators/parcel';
import jwtVerify from '../../../middlewares/auth';


const router = express.Router();
router.post('/', jwtVerify.verifyToken, validator.create, controller.createParcel);
router.get('/', jwtVerify.verifyToken, controller.getAllParcels);
router.get('/:id', jwtVerify.verifyToken, validator.validateId, controller.getOneParcel);
router.patch('/:id/cancel', jwtVerify.verifyToken, validator.validateId,
  controller.cancelParcelOrder);
router.patch('/:id/destination', jwtVerify.verifyToken,
  validator.validateAddress, controller.changeParcelDestination);
router.patch('/:id/status', jwtVerify.verifyToken, jwtVerify.isAdmin,
  validator.validateStatus, controller.changeParcelStatus);
router.patch('/:id/currentlocation', jwtVerify.verifyToken, jwtVerify.isAdmin,
  validator.validateAddress, controller.changeParcelStatus);
export default router;
