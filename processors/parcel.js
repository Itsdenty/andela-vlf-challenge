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
      const err = { error: 'An error occured' };
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
      return {
        error: 'an error occured',
      };
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
      return {
        error: 'an error occured',
      };
    }
  }

  /**
   * @description - Get all ride offers
   * @param {*} pid
   * @param {*} uid
   * @return{json} registered ride offer details
   */
  static async cancelParcelOrder(pid, uid) {
    console.log(pid, uid);
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
      return {
        error: error || 'an error occured',
      };
    }
  }
}

export default parcelProcessor;
