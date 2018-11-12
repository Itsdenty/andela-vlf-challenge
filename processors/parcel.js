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
      console.log(error);
      const err = { error: 'An error occured' };
      throw err;
    }
  }
}

export default parcelProcessor;
