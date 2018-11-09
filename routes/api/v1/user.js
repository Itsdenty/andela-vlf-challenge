import express from 'express';
import controller from '../../../controllers/user';

const router = express.Router();
router.post('/', controller.userCreate);
router.post('/login', controller.userLogin);

export default router;
