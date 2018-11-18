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
      res.status(500).json(transformer.transformResponse(500, error));
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
      res.status(500).json(transformer.transformResponse(500, error));
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
      res.status(500).json(transformer.transformResponse(500, error));
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
      const oneParcel = await processor.cancelParcelOrder(req.params.id, req.decodedToken.id);
      res.send(transformer.transformResponse(200, oneParcel));
    } catch (error) {
      res.status(500).json(transformer.transformResponse(500, error));
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
  static async changeParcelDestination(req, res) {
    try {
      const changedParcel = await processor.changeParcelDestination(req.params.id,
        req.decodedToken.id, req.body.toLocation);
      console.log(changedParcel, 'destination response');
      res.send(transformer.transformResponse(200, changedParcel));
    } catch (error) {
      console.log(error, 'destination error');
      res.status(500).json(transformer.transformResponse(500, error));
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
  static async changeParcelStatus(req, res) {
    try {
      const deliveryDate = moment().format('YYYY-MM-DD'),
        changedParcel = await processor.changeParcelStatus(req.params.id,
          req.decodedToken.id, req.body.status.toLowerCase(), deliveryDate);
      res.send(transformer.transformResponse(200, changedParcel));
    } catch (error) {
      res.status(500).json(transformer.transformResponse(500, error.error));
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
  static async changeParcelCurrentLocation(req, res) {
    try {
      const changedParcel = await processor.changeParcelCurrentLocation(req.params.id,
        req.body.currentLocation);
      res.send(transformer.transformResponse(200, changedParcel));
    } catch (error) {
      res.status(500).json(transformer.transformResponse(500, error.error));
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
  static async getUserParcels(req, res) {
    try {
      const oneParcel = await processor.getOneParcel(req.params.id);
      res.send(transformer.transformResponse(200, oneParcel));
    } catch (error) {
      res.status(500).json(transformer.transformResponse(500, error));
    }
  }
}

export default parcelController;
