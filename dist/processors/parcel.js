'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pg = require('pg');

var _postgresConfig = require('../config/postgres-config');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var clientPool = new _pg.Pool(_postgresConfig.connectionString);

/**
 * @description - Describes the Users of the app, their creation, their editing e.t.c.
 */

var parcelProcessor = function () {
  function parcelProcessor() {
    _classCallCheck(this, parcelProcessor);
  }

  _createClass(parcelProcessor, null, [{
    key: 'createParcel',

    /**
     * @description - Creates a new user in the app and assigns a token to them
     * @param{Object} parcel - api request
     * @param{Object} res - route response
     * @return{json} the registered user's detail
     */
    value: async function createParcel(parcel) {
      // Hash password to save in the database
      var createParcel = 'INSERT INTO bParcels (placedBy, weight, weightmetric, sentOn, status, fromLocation, toLocation)\n                            VALUES ($1, $2, $3, $4, $5, $6, $7)\n                            RETURNING *';
      try {
        var client = await clientPool.connect();

        var values = [parcel.placedBy, parcel.weight, parcel.weightmetric, parcel.sentOn, parcel.status, parcel.fromLocation, parcel.toLocation];

        var createdParcel = await client.query({ text: createParcel, values: values });

        var newParcel = createdParcel.rows[0];

        client.release();
        return {
          message: 'Order created',
          id: newParcel.id
        };
      } catch (error) {
        var err = { error: 'An error occured' };
        throw err;
      }
    }
  }]);

  return parcelProcessor;
}();

exports.default = parcelProcessor;