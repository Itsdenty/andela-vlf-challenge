import bcrypt from 'bcrypt';
import transformer from '../utils/transformer';
import processor from '../processors/user';

/**
 *
 *
 * @class userController
 */
class userController {
  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @memberof userController
   * @returns {*} createUser
   */
  static async userCreate(req, res) {
    const hashPassword = bcrypt.hashSync(req.body.password, 10);
    const email = req.body.email.trim().toLowerCase();
    req.body.email = email;
    req.body.password = hashPassword;
    try {
      const createUser = await processor.createUser(req);
      res.send(transformer.transformResponse(1, 'ok', createUser));
    } catch (error) {
      res.send(transformer.transformResponse(1, 'ok', error));
    }
  }


  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @memberof userController
   * @returns {*} loginUser
   */
  static async userLogin(req, res) {
    try {
      const loginUser = await processor.loginUser(req);
      res.send(transformer.transformResponse(1, 'ok', loginUser));
    } catch (error) {
      res.send(transformer.transformResponse(1, 'ok', error));
    }
  }
}
export default userController;
