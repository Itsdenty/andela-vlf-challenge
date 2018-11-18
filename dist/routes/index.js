'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/', function (req, res) {
  res.send('You\'ve reached index routes');
});

router.use('/api', _api2.default);

// 404 route
router.all('*', function (req, res) {
  var errorMessage = {
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
exports.default = router;