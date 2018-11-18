import { Pool } from 'pg';
import { connectionString } from '../config/postgres-config';

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
    // Hash password to save in the database
    const createParcel = `INSERT INTO bParcels (placedBy, weight, weightmetric, sentOn, status, fromLocation, toLocation)
                            VALUES ($1, $2, $3, $4, $5, $6, $7)
                            RETURNING *`;
    try {
      const client = await clientPool.connect(),
        values = [parcel.placedBy, parcel.weight, parcel.weightmetric,
          parcel.sentOn, parcel.status, parcel.fromLocation, parcel.toLocation],
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
    const getAll = 'SELECT * from bParcels';
    try {
      const client = await clientPool.connect(),
        getParcels = await client.query({ text: getAll }),
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
    const getAll = `SELECT * from bParcels 
                    where id=$1`,
      values = [id];
    try {
      const client = await clientPool.connect(),
        getParcels = await client.query({ text: getAll, values }),
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
    const query = `SELECT * from bParcels 
                    where id=$1 AND placedBy=$2`,
      cancelParcel = `UPDATE bParcels 
                    SET status=$1
                    WHERE id=$2`,
      values = [pid, uid];
    try {
      const client = await clientPool.connect(),
        getParcel = await client.query({ text: query, values }),
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

      const updateParcel = await client.query({ text: cancelParcel, values: ['cancelled', pid] });
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
    const query = `SELECT * from bParcels 
                    where id=$1 AND placedBy=$2`,
      cancelParcel = `UPDATE bParcels 
                    SET toLocation=$1
                    WHERE id=$2`,
      values = [pid, uid];
    try {
      const client = await clientPool.connect(),
        getParcel = await client.query({ text: query, values }),
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

      const updateParcel = await client.query({ text: cancelParcel, values: [toLocation, pid] });
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
   * @param {*} uid
   * @param {*} status
   * @param {*} deliveryDate
   * @return{json} registered ride offer details
   */
  static async changeParcelStatus(pid, uid, status, deliveryDate) {
    const query = `SELECT * from bParcels 
                    where id=$1 AND placedBy=$2`,
      deliverParcel = `UPDATE bParcels 
                        SET status=$1, deliveredOn=$2
                        WHERE id=$3`,
      statusParcel = `UPDATE bParcels 
                        SET status=$1 
                        WHERE id=$3`,
      values = [pid, uid];
    try {
      const client = await clientPool.connect(),
        getParcel = await client.query({ text: query, values }),
        parcel = getParcel.rows[0];
      if (!parcel) {
        client.release();
        const error = 'you are not authorized to change the status of this order';
        throw error;
      }
      const updateParcel = await client.query({
        text: status === 'delivered' ? deliverParcel : statusParcel,
        values: status === 'delivered' ? [status, deliveryDate, pid] : [status, pid]
      });
      client.release();
      if (updateParcel) {
        return {
          id: pid,
          status,
          message: 'Order status successfully changed'
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
   * @param {*} currentLocation
   * @return{json} registered ride offer details
   */
  static async changeParcelCurrentLocation(pid, currentLocation) {
    const query = `UPDATE bParcels 
                    SET currentLocation=$1
                    WHERE id=$2`;
    try {
      const client = await clientPool.connect();
      const updateParcel = await client.query({
        text: query,
        values: [currentLocation, pid]
      });
      client.release();
      if (updateParcel) {
        return {
          id: pid,
          currentLocation,
          message: 'Order current location successfully changed'
        };
      }
    } catch (error) {
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
    const userParcels = `SELECT * from bParcels 
                    where placedBy=$1`,
      values = [id];
    try {
      const client = await clientPool.connect(),
        getParcels = await client.query({ text: userParcels, values }),
        parcel = getParcels.rows[0];
      client.release();
      return parcel;
    } catch (error) {
      const err = 'an error occured';
      throw err;
    }
  }
}

export default parcelProcessor;
