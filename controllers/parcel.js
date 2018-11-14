import moment from 'moment';
import transformer from '../utils/transformer';
import processor from '../processors/parcel';

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
      req.body.parcel.sentOn = moment().format('YYYY-MM-DD');
      req.body.parcel.status = 'placed';
      const createParcel = await processor.createParcel(req.body.parcel);
      res.send(transformer.transformResponse(200, createParcel));
    } catch (error) {
      res.send(transformer.transformResponse(500, error.error));
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
  static async getAllParcels(req, res) {
    try {
      const getParcels = await processor.getAllParcels();
      res.send(transformer.transformResponse(200, getParcels));
    } catch (error) {
      res.send(transformer.transformResponse(500, error.error));
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
  static async getOneParcel(req, res) {
    try {
      const oneParcel = await processor.getOneParcel(req.params.id);
      res.send(transformer.transformResponse(200, oneParcel));
    } catch (error) {
      res.send(transformer.transformResponse(500, error.error));
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
  static async cancelParcelOrder(req, res) {
    try {
      const oneParcel = await processor.getOneParcel(req.params.id);
      res.send(transformer.transformResponse(200, oneParcel));
    } catch (error) {
      res.send(transformer.transformResponse(500, error.error));
    }
  }
}

export default parcelController;
