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
    const hashPassword = bcrypt.hashSync(req.body.user.password, 10);
    const email = req.body.user.email.trim().toLowerCase();
    req.body.user.email = email;
    req.body.user.password = hashPassword;
    try {
      const createUser = await processor.createUser(req.body.user);
      res.send(transformer.transformResponse(200, createUser));
    } catch (error) {
      res.send(transformer.transformResponse(400, error.error));
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
      res.send(transformer.transformResponse(200, loginUser));
    } catch (error) {
      console.log(error);
      res.send(transformer.transformResponse(400, error.error));
    }
  }
}
export default userController;
