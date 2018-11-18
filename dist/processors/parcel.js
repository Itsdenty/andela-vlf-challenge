'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // custom utility for sending email


var _pg = require('pg');

var _postgresConfig = require('../config/postgres-config');

var _mail = require('../utils/mail');

var _mail2 = _interopRequireDefault(_mail);

var _parcelQueries = require('../utils/parcelQueries');

var _parcelQueries2 = _interopRequireDefault(_parcelQueries);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// sql queries for parcel

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
      //  retrieve sql insert statement from parcelQueries
      var createParcel = _parcelQueries2.default.createParcel;


      try {
        var client = await clientPool.connect(),
            values = _parcelQueries2.default.values(parcel),
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
      //  retrieve sql statement from parcelQueries
      var getAllParcels = _parcelQueries2.default.getAllParcels;


      try {
        var client = await clientPool.connect(),
            getParcels = await client.query({ text: getAllParcels }),
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
      //  retrieve sql statement from parcelQueries
      var getOne = _parcelQueries2.default.getOne,
          values = [id];


      try {
        var client = await clientPool.connect(),
            getParcels = await client.query({ text: getOne, values: values }),
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
      //  retrieve sql statement from parcelQueries
      var getSingleParcel = _parcelQueries2.default.getSingleParcel,
          changeStatus = _parcelQueries2.default.changeStatus,
          values = [pid, uid];


      try {
        var client = await clientPool.connect(),
            getParcel = await client.query({ text: getSingleParcel, values: values }),
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

        var updateParcel = await client.query({
          text: changeStatus,
          values: ['cancelled', pid]
        });
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
      //  retrieve sql statement from parcelQueries
      var getSingleParcel = _parcelQueries2.default.getSingleParcel,
          changeDestination = _parcelQueries2.default.changeDestination,
          values = [pid, uid];


      try {
        var client = await clientPool.connect(),
            getParcel = await client.query({ text: getSingleParcel, values: values }),
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

        var updateParcel = await client.query({
          text: changeDestination,
          values: [toLocation, pid]
        });
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
     * @param {*} status
     * @param {*} deliveryDate
     * @return{json} registered ride offer details
     */

  }, {
    key: 'changeParcelStatus',
    value: async function changeParcelStatus(pid, status, deliveryDate) {
      //  retrieve sql statement from parcelQueries
      var parcelUser = _parcelQueries2.default.parcelUser,
          deliverParcel = _parcelQueries2.default.deliverParcel,
          changeStatus = _parcelQueries2.default.changeStatus,
          values = [pid];


      try {
        var client = await clientPool.connect(),
            userParcel = await client.query({ text: parcelUser, values: values }),
            updateParcel = await client.query({
          text: status === 'delivered' ? deliverParcel : changeStatus,
          values: status === 'delivered' ? [status, deliveryDate, pid] : [status, pid]
        }),
            user = userParcel.rows[0],
            mailIt = await _mail2.default.notifyStatus(user, status);
        console.log(mailIt);
        client.release();

        if (updateParcel) {
          return {
            id: pid,
            status: status,
            message: 'Order status successfully changed'
          };
        }
      } catch (error) {
        console.log(error);
        var err = 'an error occured';
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
      //  retrieve sql statement from parcelQueries
      var changeLocation = _parcelQueries2.default.changeLocation,
          parcelUser = _parcelQueries2.default.parcelUser;


      try {
        var client = await clientPool.connect();
        var updateParcel = await client.query({
          text: changeLocation,
          values: [currentLocation, pid]
        });
        var userParcel = await client.query({
          text: parcelUser,
          values: [pid]
        }),
            user = userParcel.rows[0],
            mailIt = await _mail2.default.notifyLocation(user, currentLocation);

        client.release();
        console.log(mailIt);

        if (updateParcel) {
          return {
            id: pid,
            currentLocation: currentLocation,
            message: 'Order current location successfully changed'
          };
        }
      } catch (error) {
        console.log(error);
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
      //  retrieve sql statement from parcelQueries
      var userParcels = _parcelQueries2.default.userParcels,
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