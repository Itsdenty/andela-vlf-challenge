import express from 'express';
import controller from '../../../controllers/user';
import validator from '../../../middlewares/validators/user';
import jwtVerify from '../../../middlewares/auth';


const router = express.Router();
router.post('/', jwtVerify.verifyToken, validator.create, controller.userCreate);

export default router;
