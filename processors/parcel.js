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
      const client = await clientPool.connect();

      const values = [parcel.placedBy, parcel.weight, parcel.weightmetric,
        parcel.sentOn, parcel.status, parcel.fromLocation, parcel.toLocation];

      const createdParcel = await client.query({ text: createParcel, values });

      const newParcel = createdParcel.rows[0];

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
      const client = await clientPool.connect();
      const getParcels = await client.query({ text: getAll });
      const parcels = getParcels.rows;

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
      const client = await clientPool.connect();
      const getParcels = await client.query({ text: getAll, values });
      const parcel = getParcels.rows[0];

      client.release();
      return parcel;
    } catch (error) {
      return {
        error: 'an error occured',
      };
    }
  }
}

export default parcelProcessor;
