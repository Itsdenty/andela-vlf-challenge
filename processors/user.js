import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';
import createToken from '../utils/createToken';
import { connectionString } from '../config/postgres-config';

const clientPool = new Pool(connectionString),
  secretKey = process.env.JWT_SECRET;

/**
 * @description - Describes the Users of the app, their creation, their editing e.t.c.
 */
class userProcessor {
  /**
   * @description - Creates a new user in the app and assigns a token to them
   * @param{Object} user - api request
   * @param{Object} res - route response
   * @return{json} the registered user's detail
   */
  static async createUser(user) {
    // Hash password to save in the database
    const createUser = `INSERT INTO aUsers (firstName, lastName, otherNames, username, email, password, isAdmin)
                            VALUES ($1, $2, $3, $4, $5, $6, $7)
                            RETURNING *`;
    try {
      const client = await clientPool.connect();

      const values = [user.firstName, user.lastName, user.otherNames,
        user.username, user.email, user.password, user.isAdmin];

      const createdUser = await client.query({ text: createUser, values });

      const signedupUser = createdUser.rows[0];
      delete signedupUser.password;
      const {
        id, firstName, lastName
      } = createdUser.rows[0];

      // create the token after all the inputs are certified ok
      const authToken = createToken.token({ id, firstName, lastName }, secretKey);
      client.release();
      return {
        message: 'User created successfully',
        user: signedupUser,
        token: authToken,
      };
    } catch (error) {
      const err = { error: 'and error occured or user already exists' };
      throw err;
    }
  }

  /**
   * @description - Signs a user in by creating a session token
   * @param{Object} req - api request
   * @param{Object} res - route response
   * @return{json} the user's login status
   */
  static async loginUser(req) {
    const email = req.body.login.email.trim().toLowerCase();
    const findOneUser = `SELECT * FROM aUsers
                          WHERE email = $1`;
    try {
      const client = await clientPool.connect();
      // find a user with the given email
      const user = await client.query({ text: findOneUser, values: [email] });
      if (user.rows[0].id) {
        const signedInUser = user.rows[0];
        // check it the password matches
        const password = await bcrypt.compare(req.body.login.password, user.rows[0].password);
        if (!password) {
          // return { message: 'wrong password!' };
          throw new Error('wrong password!');
        }
        // creates a token that lasts for 24 hours
        const {
          id, firstname, lastname
        } = user.rows[0];
        delete signedInUser.password;
        const authToken = createToken.token({ id, firstname, lastname }, secretKey);
        return {
          message: 'You are logged in!',
          token: authToken,
          user: signedInUser
        };
      }
      throw new Error('user not found');
    } catch (error) {
      const err = { error: 'wrong username or password' };
      throw err;
    }
  }
}

export default userProcessor;
