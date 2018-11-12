import bcrypt from 'bcrypt';
import transformer from '../utils/transformer';
import processor from '../processors/user';

/**
 *
 *
 * @class parcelController
 */
class parcelController {
  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @memberof parcelController
   * @returns {json} createParcel response
   */
  static async createParcel(req, res) {
    try {
      const createParcel = await processor.createUser(req.body.parcel);
      res.send(transformer.transformResponse(200, createParcel));
    } catch (error) {
      res.send(transformer.transformResponse(400, error.error));
    }
  }
}

export default parcelController;
