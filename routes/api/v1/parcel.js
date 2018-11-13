import express from 'express';
import controller from '../../../controllers/parcel';
import validator from '../../../middlewares/validators/parcel';
import jwtVerify from '../../../middlewares/auth';


const router = express.Router();
router.post('/', jwtVerify.verifyToken, validator.create, controller.createParcel);
router.get('/', jwtVerify.verifyToken);

export default router;
