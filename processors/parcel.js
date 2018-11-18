import { Pool } from 'pg';
import { connectionString } from '../config/postgres-config';
import mail from '../utils/mail'; // custom utility for sending email
import parcelQueries from '../utils/parcelQueries'; // sql queries for parcel

const clientPool = new Pool(connectionString);

/**
 * @description - Describes the Users of the app, their creation, their editing e.t.c.
 */
class parcelProcessor {
  /**
   * @description - Creates a new user in the app and assigns a token to them
   * @param{Object} parcel - api request
   * @param{Object} res - route response
   * @return{json} the registered user's detail
   */
  static async createParcel(parcel) {
    //  retrieve sql insert statement from parcelQueries
    const { createParcel } = parcelQueries;

    try {
      const client = await clientPool.connect(),
        values = parcelQueries.values(parcel),
        createdParcel = await client.query({ text: createParcel, values }),
        newParcel = createdParcel.rows[0];

      client.release();
      return {
        message: 'Order created',
        id: newParcel.id
      };
    } catch (error) {
      const err = 'an error occured';
      throw err;
    }
  }

  /**
   * @description - Get all ride offers
   * @return{json} registered ride offer details
   */
  static async getAllParcels() {
    //  retrieve sql statement from parcelQueries
    const { getAllParcels } = parcelQueries;

    try {
      const client = await clientPool.connect(),
        getParcels = await client.query({ text: getAllParcels }),
        parcels = getParcels.rows;

      client.release();
      return parcels;
    } catch (error) {
      const err = error.error ? 'an error occured' : error;
      throw err;
    }
  }

  /**
   * @description - Get all ride offers
   * @param {*} id
   * @return{json} registered ride offer details
   */
  static async getOneParcel(id) {
    //  retrieve sql statement from parcelQueries
    const { getOne } = parcelQueries,
      values = [id];

    try {
      const client = await clientPool.connect(),
        getParcels = await client.query({ text: getOne, values }),
        parcel = getParcels.rows[0];

      client.release();
      return parcel;
    } catch (error) {
      const err = error.error ? 'an error occured' : error;
      throw err;
    }
  }

  /**
   * @description - Get all ride offers
   * @param {*} pid
   * @param {*} uid
   * @return{json} registered ride offer details
   */
  static async cancelParcelOrder(pid, uid) {
    //  retrieve sql statement from parcelQueries
    const { getSingleParcel, changeStatus } = parcelQueries,
      values = [pid, uid];

    try {
      const client = await clientPool.connect(),
        getParcel = await client.query({ text: getSingleParcel, values }),
        parcel = getParcel.rows[0];

      if (!parcel) {
        client.release();
        const error = 'you are not authorized to cancel this order';
        throw error;
      } else if (parcel.status === 'delivered') {
        client.release();
        const error = 'you cannot cancel an already delivered parcel';
        throw error;
      }

      const updateParcel = await client.query({
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
      const err = error.error ? 'an error occured' : error;
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
  static async changeParcelDestination(pid, uid, toLocation) {
    //  retrieve sql statement from parcelQueries
    const { getSingleParcel, changeDestination } = parcelQueries,
      values = [pid, uid];

    try {
      const client = await clientPool.connect(),
        getParcel = await client.query({ text: getSingleParcel, values }),
        parcel = getParcel.rows[0];

      if (!parcel) {
        client.release();
        const error = 'you are not authorized to change the destination of this order';
        throw error;
      } else if (parcel.status === 'delivered') {
        client.release();
        const error = 'you cannot change the destination of an already delivered parcel';
        throw error;
      }

      const updateParcel = await client.query({
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
      const err = error.error ? 'an error occured' : error;
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
  static async changeParcelStatus(pid, status, deliveryDate) {
    //  retrieve sql statement from parcelQueries
    const { parcelUser, deliverParcel, changeStatus } = parcelQueries,
      values = [pid];

    try {
      const client = await clientPool.connect(),
        userParcel = await client.query({ text: parcelUser, values }),
        updateParcel = await client.query({
          text: status === 'delivered' ? deliverParcel : changeStatus,
          values: status === 'delivered' ? [status, deliveryDate, pid] : [status, pid]
        }),
        user = userParcel.rows[0],
        mailIt = await mail.notifyStatus(user, status);
      console.log(mailIt);
      client.release();

      if (updateParcel) {
        return {
          id: pid,
          status,
          message: 'Order status successfully changed'
        };
      }
    } catch (error) {
      console.log(error);
      const err = 'an error occured';
      throw err;
    }
  }

  /**
   * @description - Get all ride offers
   * @param {*} pid
   * @param {*} currentLocation
   * @return{json} registered ride offer details
   */
  static async changeParcelCurrentLocation(pid, currentLocation) {
    //  retrieve sql statement from parcelQueries
    const { changeLocation, parcelUser } = parcelQueries;

    try {
      const client = await clientPool.connect();
      const updateParcel = await client.query({
        text: changeLocation,
        values: [currentLocation, pid]
      });
      const userParcel = await client.query({
          text: parcelUser,
          values: [pid]
        }),
        user = userParcel.rows[0],
        mailIt = await mail.notifyLocation(user, currentLocation);

      client.release();
      console.log(mailIt);

      if (updateParcel) {
        return {
          id: pid,
          currentLocation,
          message: 'Order current location successfully changed'
        };
      }
    } catch (error) {
      console.log(error);
      const err = 'an error occured';
      throw err;
    }
  }

  /**
   * @description - Get all ride offers
   * @param {*} id
   * @return{json} registered ride offer details
   */
  static async getUserParcels(id) {
    //  retrieve sql statement from parcelQueries
    const { userParcels } = parcelQueries,
      values = [id];

    try {
      const client = await clientPool.connect(),
        getParcels = await client.query({ text: userParcels, values }),
        parcel = getParcels.rows;
      client.release();
      return parcel;
    } catch (error) {
      const err = 'an error occured';
      throw err;
    }
  }
}

export default parcelProcessor;
