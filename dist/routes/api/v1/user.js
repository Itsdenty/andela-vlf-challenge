'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import controller from '../../../controllers/user'

// const router = express.Router();
var router = _express2.default.Router();
router.get('/', 'route is still under development please try again later');
// router.post('/', controller.userCreate);
// router.post('/login', controller.userLogin);
// router.get('/logout', controller.userLogout);

exports.default = router;