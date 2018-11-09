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
   * @returns {json} createUser response
   */
  static async userCreate(req, res) {
    console.log(req.body.user);
    const hashPassword = bcrypt.hashSync(req.body.user.password, 10);
    const email = req.body.user.email.trim().toLowerCase();
    req.body.user.email = email;
    req.body.user.password = hashPassword;
    try {
      const createUser = await processor.createUser(req.body.user);
      res.send(transformer.transformResponse(1, createUser));
    } catch (error) {
      res.send(transformer.transformResponse(0, error));
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
