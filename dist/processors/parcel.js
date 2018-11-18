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
        var client = await clientPool.connect(),
            values = [parcel.placedBy, parcel.weight, parcel.weightmetric, parcel.sentOn, parcel.status, parcel.fromLocation, parcel.toLocation],
            createdParcel = await client.query({ text: createParcel, values: values }),
            newParcel = createdParcel.rows[0];

        client.release();
        return {
          message: 'Order created',
          id: newParcel.id
        };
      } catch (error) {
        var err = 'an error occured';
        throw err;
      }
    }

    /**
     * @description - Get all ride offers
     * @return{json} registered ride offer details
     */

  }, {
    key: 'getAllParcels',
    value: async function getAllParcels() {
      var getAll = 'SELECT * from bParcels';
      try {
        var client = await clientPool.connect(),
            getParcels = await client.query({ text: getAll }),
            parcels = getParcels.rows;

        client.release();
        return parcels;
      } catch (error) {
        var err = error.error ? 'an error occured' : error;
        throw err;
      }
    }

    /**
     * @description - Get all ride offers
     * @param {*} id
     * @return{json} registered ride offer details
     */

  }, {
    key: 'getOneParcel',
    value: async function getOneParcel(id) {
      var getAll = 'SELECT * from bParcels \n                    where id=$1',
          values = [id];
      try {
        var client = await clientPool.connect(),
            getParcels = await client.query({ text: getAll, values: values }),
            parcel = getParcels.rows[0];

        client.release();
        return parcel;
      } catch (error) {
        var err = error.error ? 'an error occured' : error;
        throw err;
      }
    }

    /**
     * @description - Get all ride offers
     * @param {*} pid
     * @param {*} uid
     * @return{json} registered ride offer details
     */

  }, {
    key: 'cancelParcelOrder',
    value: async function cancelParcelOrder(pid, uid) {
      var query = 'SELECT * from bParcels \n                    where id=$1 AND placedBy=$2',
          cancelParcel = 'UPDATE bParcels \n                    SET status=$1\n                    WHERE id=$2',
          values = [pid, uid];
      try {
        var client = await clientPool.connect(),
            getParcel = await client.query({ text: query, values: values }),
            parcel = getParcel.rows[0];
        if (!parcel) {
          client.release();
          var error = 'you are not authorized to cancel this order';
          throw error;
        } else if (parcel.status === 'delivered') {
          client.release();
          var _error = 'you cannot cancel an already delivered parcel';
          throw _error;
        }

        var updateParcel = await client.query({ text: cancelParcel, values: ['cancelled', pid] });
        client.release();
        if (updateParcel) {
          return {
            id: pid,
            message: 'Order cancelled'
          };
        }
      } catch (error) {
        var err = error.error ? 'an error occured' : error;
        throw err;
      }
    }

    /**
     * @description - Get all ride offers
     * @param {*} pid
     * @param {*} uid
     * @param {*} toLocation
     * @return{json} registered ride offer details
     */

  }, {
    key: 'changeParcelDestination',
    value: async function changeParcelDestination(pid, uid, toLocation) {
      var query = 'SELECT * from bParcels \n                    where id=$1 AND placedBy=$2',
          cancelParcel = 'UPDATE bParcels \n                    SET toLocation=$1\n                    WHERE id=$2',
          values = [pid, uid];
      try {
        var client = await clientPool.connect(),
            getParcel = await client.query({ text: query, values: values }),
            parcel = getParcel.rows[0];
        if (!parcel) {
          client.release();
          var error = 'you are not authorized to change the destination of this order';
          throw error;
        } else if (parcel.status === 'delivered') {
          client.release();
          var _error2 = 'you cannot change the destination of an already delivered parcel';
          throw _error2;
        }

        var updateParcel = await client.query({ text: cancelParcel, values: [toLocation, pid] });
        client.release();
        if (updateParcel) {
          return {
            id: pid,
            message: 'Order destination successfully changed'
          };
        }
      } catch (error) {
        var err = error.error ? 'an error occured' : error;
        throw err;
      }
    }

    /**
     * @description - Get all ride offers
     * @param {*} pid
     * @param {*} uid
     * @param {*} status
     * @param {*} deliveryDate
     * @return{json} registered ride offer details
     */

  }, {
    key: 'changeParcelStatus',
    value: async function changeParcelStatus(pid, uid, status, deliveryDate) {
      var query = 'SELECT * from bParcels \n                    where id=$1 AND placedBy=$2',
          deliverParcel = 'UPDATE bParcels \n                        SET status=$1, deliveredOn=$2\n                        WHERE id=$3',
          statusParcel = 'UPDATE bParcels \n                        SET status=$1 \n                        WHERE id=$3',
          values = [pid, uid];
      try {
        var client = await clientPool.connect(),
            getParcel = await client.query({ text: query, values: values }),
            parcel = getParcel.rows[0];
        if (!parcel) {
          client.release();
          var error = 'you are not authorized to change the status of this order';
          throw error;
        }
        var updateParcel = await client.query({
          text: status === 'delivered' ? deliverParcel : statusParcel,
          values: status === 'delivered' ? [status, deliveryDate, pid] : [status, pid]
        });
        client.release();
        if (updateParcel) {
          return {
            id: pid,
            status: status,
            message: 'Order status successfully changed'
          };
        }
      } catch (error) {
        var err = error.error ? 'an error occured' : error;
        throw err;
      }
    }

    /**
     * @description - Get all ride offers
     * @param {*} pid
     * @param {*} currentLocation
     * @return{json} registered ride offer details
     */

  }, {
    key: 'changeParcelCurrentLocation',
    value: async function changeParcelCurrentLocation(pid, currentLocation) {
      var query = 'UPDATE bParcels \n                    SET currentLocation=$1\n                    WHERE id=$2';
      try {
        var client = await clientPool.connect();
        var updateParcel = await client.query({
          text: query,
          values: [currentLocation, pid]
        });
        client.release();
        if (updateParcel) {
          return {
            id: pid,
            currentLocation: currentLocation,
            message: 'Order current location successfully changed'
          };
        }
      } catch (error) {
        var err = 'an error occured';
        throw err;
      }
    }

    /**
     * @description - Get all ride offers
     * @param {*} id
     * @return{json} registered ride offer details
     */

  }, {
    key: 'getUserParcels',
    value: async function getUserParcels(id) {
      var userParcels = 'SELECT * from bParcels \n                    where placedBy=$1',
          values = [id];
      try {
        var client = await clientPool.connect(),
            getParcels = await client.query({ text: userParcels, values: values }),
            parcel = getParcels.rows;
        client.release();
        return parcel;
      } catch (error) {
        var err = 'an error occured';
        throw err;
      }
    }
  }]);

  return parcelProcessor;
}();

exports.default = parcelProcessor;