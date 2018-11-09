import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';
import createToken from '../utils/createToken';
import connectionString from '../config/postgres-config';

const clientPool = new Pool(connectionString);

const secretKey = process.env.JWT_SECRET;

/**
 * @description - Describes the Users of the app, their creation, their editing e.t.c.
 */
class userProcessor {
  /**
   * @description - Creates a new user in the app and assigns a token to them
   * @param{Object} req - api request
   * @param{Object} res - route response
   * @return{json} the registered user's detail
   */
  static async createUser(req) {
    // Hash password to save in the database
    const createUser = `INSERT INTO aUsers (firstName, lastName, phoneNo, username, email, password)
                            VALUES ($1, $2, $3, $4, $5, $6)
                            RETURNING *`;
    try {
      const client = await clientPool.connect();

      const values = [req.body.firstName, req.body.lastName, req.body.phoneNo,
        req.body.username, req.body.email, req.body.password];

      const createdUser = await client.query({ text: createUser, values });

      const signedupUser = createdUser.rows[0];

      const {
        userId, firstName, lastName
      } = createdUser.rows[0];

      // create the token after all the inputs are certified ok
      const authToken = createToken.token({ userId, firstName, lastName }, secretKey);
      client.release();
      return {
        message: 'User created successfully',
        user: signedupUser,
        token: authToken,
      };
    } catch (error) {
      return {
        message: 'Check your input and try again pls, you might be entering a wrong input',
      };
    }
  }

  /**
   * @description - Signs a user in by creating a session token
   * @param{Object} req - api request
   * @param{Object} res - route response
   * @return{json} the user's login status
   */
  static async loginUser(req) {
    const email = req.body.email.trim().toLowerCase();
    const findOneUser = `SELECT * FROM aUsers
                          WHERE email = $1`;
    // checks if a token was passed into the request header
    if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, secretKey);
        req.userData = decoded.userid;
        if (req.userData !== null) {
          return { message: 'You are already logged in' };
        }
      } catch (error) {
        return { message: 'Token is invalid or has expired, Please re-login' };
      }
    }
    try {
      const client = await clientPool.connect();
      // find a user with the given email
      const user = await client.query({ text: findOneUser, values: [email] });
      if (user.rows[0]) {
        const signedInUser = user.rows[0];
        // check it the password matches
        const correctPassword = await bcrypt.compare(req.body.password, user.rows[0].password);
        if (!correctPassword) {
          return { message: 'wrong password!' };
        }
        // creates a token that lasts for 24 hours
        const {
          userid, firstname, lastname
        } = user.rows[0];
        const authToken = createToken.token({ userid, firstname, lastname }, secretKey);
        return {
          message: 'You are logged in!',
          token: authToken,
          user: signedInUser
        };
      }
    } catch (error) {
      return { message: 'An error occured' };
    }
  }
}

export default userProcessor;
