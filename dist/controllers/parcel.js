'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _transformer = require('../utils/transformer');

var _transformer2 = _interopRequireDefault(_transformer);

var _parcel = require('../processors/parcel');

var _parcel2 = _interopRequireDefault(_parcel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *
 *
 * @class parcelController
 */
var parcelController = function () {
  function parcelController() {
    _classCallCheck(this, parcelController);
  }

  _createClass(parcelController, null, [{
    key: 'createParcel',

    /**
     *
     *
     * @static
     * @param {*} req
     * @param {*} res
     * @memberof parcelController
     * @returns {json} createParcel response
     */
    value: async function createParcel(req, res) {
      try {
        req.body.parcel.sentOn = (0, _moment2.default)().format('YYYY-MM-DD');
        req.body.parcel.status = 'placed';
        var createParcel = await _parcel2.default.createParcel(req.body.parcel);
        res.send(_transformer2.default.transformResponse(200, createParcel));
      } catch (error) {
        res.send(_transformer2.default.transformResponse(500, error.error));
      }
    }

    /**
     *
     *
     * @static
     * @param {*} req
     * @param {*} res
     * @memberof parcelController
     * @returns {json} createParcel response
     */

  }, {
    key: 'getAllParcels',
    value: async function getAllParcels(req, res) {
      try {
        var getParcels = await _parcel2.default.getAllParcels();
        res.send(_transformer2.default.transformResponse(200, getParcels));
      } catch (error) {
        res.send(_transformer2.default.transformResponse(500, error.error));
      }
    }
  }]);

  return parcelController;
}();

exports.default = parcelController;