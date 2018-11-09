/**
 * @swagger
 * securityDefinitions:
 *   Bearer:
 *     type: apiKey
 *     name: Authorization
 *     in: header
 * definition:
 *   User:
 *     properties:
 *       firstName:
 *         type: string
 *       lastName:
 *         type: string
 *       username:
 *         type: string
 *       otherNames:
 *         type: string
 *       email:
 *         type: string
 *         format: email
 *       password:
 *         type: string
 *       isAdmin:
 *         type: boolean
 *   Login:
 *     properties:
 *       email:
 *         type: string
 *       password:
 *         type: string
 *   UserModel:
 *     properties:
 *       user:
 *         $ref: '#/definitions/User'
 *   LoginModel:
 *     properties:
 *       login:
 *         $ref: '#/definitions/Login'
 *   UserObject:
 *     properties:
 *       userId:
 *         type: string
 *       firstName:
 *         type: string
 *       lastName:
 *         type: string
 *       username:
 *         type: string
 *       otherNames:
 *         type: string
 *       email:
 *         type: string
 *       isAdmin:
 *         type: boolean
 *   UserResponse:
 *     properties:
 *       message:
 *         type: string
 *       token:
 *         type: string
 *       user:
 *         $ref: '#/definitions/UserObject'
 *   ResponseObjectSingle:
 *     properties:
 *       status:
 *         type: number
 *       data:
 *         $ref: '#/definitions/UserResponse'
 *   ResponseObjectLogout:
 *     properties:
 *       status:
 *         type: number
 *       data:
 *         type: object
 *         properties:
 *         message:
 *           type: string
 *   ErrorObject:
 *     properties:
 *       status:
 *         type: number
 *       error:
 *         type: object
 *         properties:
 *         message:
 *           type: string
 *   Token:
 *     properties:
 *       token:
 *         type: string
 */

/**
 * @swagger
 * /user:
 *   post:
 *     tags:
 *       - User
 *     description: Registers a new user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: user signup credentials
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/UserModel'
 *     responses:
 *       200:
 *         description: Successfully created
 *         schema:
 *           $ref: '#/definitions/ResponseObjectSingle'
 *       400:
 *         description: You supplied and invalid user field
 *         schema:
 *           $ref: '#/definitions/ErrorObject'
 */

/**
 * @swagger
 * /user/login:
 *   post:
 *     tags:
 *       - User
 *     description: Log a user in
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: login
 *         description: User login credentials
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/LoginModel'
 *     responses:
 *       200:
 *         description: Successfully created
 *         schema:
 *           $ref: '#definitions/ResponseObjectSingle'
 *       400:
 *         description: An error occured
 *         schema:
 *           $ref: '#/definitions/ErrorObject'
 */
"use strict";