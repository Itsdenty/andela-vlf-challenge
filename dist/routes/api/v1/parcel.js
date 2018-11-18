'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _parcel = require('../../../controllers/parcel');

var _parcel2 = _interopRequireDefault(_parcel);

var _parcel3 = require('../../../middlewares/validators/parcel');

var _parcel4 = _interopRequireDefault(_parcel3);

var _auth = require('../../../middlewares/auth');

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
router.post('/', _auth2.default.verifyToken, _parcel4.default.create, _parcel2.default.createParcel);
router.get('/', _auth2.default.verifyToken, _parcel2.default.getAllParcels);
router.get('/:id', _auth2.default.verifyToken, _parcel4.default.validateId, _parcel2.default.getOneParcel);
router.patch('/:id/cancel', _auth2.default.verifyToken, _parcel4.default.validateId, _parcel2.default.cancelParcelOrder);
router.patch('/:id/destination', _auth2.default.verifyToken, _parcel4.default.validateDestination, _parcel2.default.changeParcelDestination);
router.patch('/:id/status', _auth2.default.verifyToken, _auth2.default.isAdmin, _parcel4.default.validateStatus, _parcel2.default.changeParcelStatus);
router.patch('/:id/currentlocation', _auth2.default.verifyToken, _auth2.default.isAdmin, _parcel4.default.validateCurrentLocation, _parcel2.default.changeParcelCurrentLocation);
exports.default = router;