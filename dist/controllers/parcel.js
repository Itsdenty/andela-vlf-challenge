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
        res.status(500).json(_transformer2.default.transformResponse(500, error));
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
        res.status(500).json(_transformer2.default.transformResponse(500, error));
      }
    }

    /**
     *
     *
     * @static
     * @param {*} req
     * @param {*} res
     * @memberof parcelController
     * @returns {json} oneParcel response
     */

  }, {
    key: 'getOneParcel',
    value: async function getOneParcel(req, res) {
      try {
        var oneParcel = await _parcel2.default.getOneParcel(req.params.id);
        res.send(_transformer2.default.transformResponse(200, oneParcel));
      } catch (error) {
        res.status(500).json(_transformer2.default.transformResponse(500, error));
      }
    }

    /**
     *
     *
     * @static
     * @param {*} req
     * @param {*} res
     * @memberof parcelController
     * @returns {json} oneParcel response
     */

  }, {
    key: 'cancelParcelOrder',
    value: async function cancelParcelOrder(req, res) {
      try {
        var oneParcel = await _parcel2.default.cancelParcelOrder(req.params.id, req.decodedToken.id);
        res.send(_transformer2.default.transformResponse(200, oneParcel));
      } catch (error) {
        res.status(500).json(_transformer2.default.transformResponse(500, error));
      }
    }

    /**
     *
     *
     * @static
     * @param {*} req
     * @param {*} res
     * @memberof parcelController
     * @returns {json} oneParcel response
     */

  }, {
    key: 'changeParcelDestination',
    value: async function changeParcelDestination(req, res) {
      try {
        var changedParcel = await _parcel2.default.changeParcelDestination(req.params.id, req.decodedToken.id, req.body.toLocation);
        console.log(changedParcel, 'destination response');
        res.send(_transformer2.default.transformResponse(200, changedParcel));
      } catch (error) {
        console.log(error, 'destination error');
        res.status(500).json(_transformer2.default.transformResponse(500, error));
      }
    }

    /**
     *
     *
     * @static
     * @param {*} req
     * @param {*} res
     * @memberof parcelController
     * @returns {json} oneParcel response
     */

  }, {
    key: 'changeParcelStatus',
    value: async function changeParcelStatus(req, res) {
      try {
        var deliveryDate = (0, _moment2.default)().format('YYYY-MM-DD'),
            changedParcel = await _parcel2.default.changeParcelStatus(req.params.id, req.decodedToken.id, req.body.status.toLowerCase(), deliveryDate);
        res.send(_transformer2.default.transformResponse(200, changedParcel));
      } catch (error) {
        res.status(500).json(_transformer2.default.transformResponse(500, error.error));
      }
    }

    /**
     *
     *
     * @static
     * @param {*} req
     * @param {*} res
     * @memberof parcelController
     * @returns {json} oneParcel response
     */

  }, {
    key: 'changeParcelCurrentLocation',
    value: async function changeParcelCurrentLocation(req, res) {
      try {
        var changedParcel = await _parcel2.default.changeParcelCurrentLocation(req.params.id, req.body.currentLocation);
        res.send(_transformer2.default.transformResponse(200, changedParcel));
      } catch (error) {
        res.status(500).json(_transformer2.default.transformResponse(500, error.error));
      }
    }

    /**
     *
     *
     * @static
     * @param {*} req
     * @param {*} res
     * @memberof parcelController
     * @returns {json} oneParcel response
     */

  }, {
    key: 'getUserParcels',
    value: async function getUserParcels(req, res) {
      try {
        var oneParcel = await _parcel2.default.getUserParcels(req.params.id);
        res.send(_transformer2.default.transformResponse(200, oneParcel));
      } catch (error) {
        res.status(500).json(_transformer2.default.transformResponse(500, error));
      }
    }
  }]);

  return parcelController;
}();

exports.default = parcelController;