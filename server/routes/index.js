import express from 'express';
import api from './api';

const router = express.Router();


router.get('/', (req, res) => {
  res.send('You\'ve reached index routes');
});

router.use('/api', api);


// 404 route
router.all('*', (req, res) => {
  const errorMessage = {
    message: 'You are hitting a wrong route, find the valid routes below',
    endpoints: {
      signup: 'POST /api/v1/auth/signup',
      login: 'POST /api/v1/auth/login',
      createParcelOrder: 'POST /api/v1/parcels',
      getAllParcels: 'GET /api/v1/parcels',
      getOneParcel: 'GET /api/v1/parcels/:id',
      cancelParcelOrder: 'PATCH /api/v1/parcels/:id/cancel',
      changeParcelDestination: 'PATCH /api/v1/parces/id/destination',
      changeParcelStatus: 'PATCH /api/v1/parces/id/status',
      changeCurrentLocation: 'PATCH /api/v1/parces/id/currentLocation',
      getUserParcels: 'GET /api/v1/users/:id/parcels'
    },
    success: false
  };
  res.status(404).json(errorMessage);
});
export default router;
