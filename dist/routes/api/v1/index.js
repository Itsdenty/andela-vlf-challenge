'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _swaggerJsdoc = require('swagger-jsdoc');

var _swaggerJsdoc2 = _interopRequireDefault(_swaggerJsdoc);

var _user = require('./user');

var _user2 = _interopRequireDefault(_user);

var _parcel = require('./parcel');

var _parcel2 = _interopRequireDefault(_parcel);

var _parcel3 = require('../../../controllers/parcel');

var _parcel4 = _interopRequireDefault(_parcel3);

var _parcel5 = require('../../../middlewares/validators/parcel');

var _parcel6 = _interopRequireDefault(_parcel5);

var _auth = require('../../../middlewares/auth');

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

// Swagger jsdoc configuration
var swaggerDefinition = {
  info: {
    title: 'Node Swagger API',
    version: '1.0.0',
    description: 'Api documentation for Andela vlf challenge.'
  },
  host: 'localhost:3100',
  basePath: '/api/v1'
};

// options for the swagger docs
var options = {

  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,

  // path to the API docs
  apis: ['./swagger/*.js']

};

// initialize swagger-jsdoc
var swaggerSpec = (0, _swaggerJsdoc2.default)(options);

// setup swagger route
router.get('/swagger.json', function (req, res) {
  res.header('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// api v1 routes
router.get('/', function (req, res) {
  res.send('You\'ve reached api/v1 routes');
});
router.get('/users/:id/parcels', _auth2.default.verifyToken, _parcel6.default.validateId, _parcel4.default.getUserParcels);
router.use('/auth', _user2.default);
router.use('/parcels', _parcel2.default);

exports.default = router;