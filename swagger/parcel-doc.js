/**
 * @swagger
 * securityDefinitions:
 *   Bearer:
 *     type: apiKey
 *     name: Authorization
 *     in: header
 * definition:
 *   ParcelObject:
 *     properties:
 *       id:
 *         type: integer
 *       placedby:
 *         type: number
 *       weight:
 *         type: number
 *       weightmetric:
 *         type: string
 *       fromlocation:
 *         type: string
 *       tolocation:
 *         type: string
 *       status:
 *         type: string
 *       deliveredOn:
 *         type: string
 *       currentLocation:
 *         type: string
 *       createat:
 *         type: string
 *   Parcel:
 *     properties:
 *       placedBy:
 *         type: number
 *       weight:
 *         type: number
 *       weightmetric:
 *         type: string
 *       fromLocation:
 *         type: string
 *       toLocation:
 *         type: string
 *   ParcelModel:
 *     properties:
 *       parcel:
 *         $ref: '#/definitions/Parcel'
 *   ParcelResponse:
 *     properties:
 *       message:
 *         type: string
 *       id:
 *         type: number
 *   ResponseObjectSingleParcel:
 *     properties:
 *       status:
 *         type: number
 *       data:
 *         $ref: '#/definitions/ParcelObject'
 *   ResponseObjectParcel:
 *     properties:
 *       status:
 *         type: number
 *       data:
 *         type: array
 *         items:
 *           $ref: '#/definitions/ParcelObject'
 *   ManipulationObject:
 *     properties:
 *       message:
 *         type: string
 *       id:
 *         type: number
 *   StatusObject:
 *     properties:
 *       message:
 *         type: string
 *       status:
 *         type: string
 *       id:
 *         type: number
 *   CurrentLocationObject:
 *     properties:
 *       message:
 *         type: string
 *       currentLocation:
 *         type: string
 *       id:
 *         type: number
 *   UpdateObjectParcel:
 *     properties:
 *       status:
 *         type: number
 *       data:
 *           $ref: '#/definitions/ManipulationObject'
 *   StatusObjectParcel:
 *     properties:
 *       status:
 *         type: number
 *       data:
 *           $ref: '#/definitions/StatusObject'
 *   CurrentLocationObjectParcel:
 *     properties:
 *       status:
 *         type: number
 *       data:
 *           $ref: '#/definitions/StatusObject'
 *   ErrorObject:
 *     properties:
 *       status:
 *         type: number
 *       error:
 *         type: string
 *   Token:
 *     properties:
 *       token:
 *         type: string
 */

/**
 * @swagger
 * /parcels:
 *   post:
 *     tags:
 *       - Parcel
 *     description: Creates a new parcel order
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: user signup credentials
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/ParcelModel'
 *     responses:
 *       200:
 *         description: Successfully created
 *         schema:
 *           $ref: '#/definitions/ParcelResponse'
 *       500:
 *         description: Server error exists
 *         schema:
 *           $ref: '#/definitions/ErrorObject'
 *       400:
 *         description: Validation error exists
 *         schema:
 *           $ref: '#/definitions/ErrorObject'
 *       401:
 *         description: Authentication error exists
 *         schema:
 *           $ref: '#/definitions/ErrorObject'
 *       403:
 *         description: Authourization error exists
 *         schema:
 *           $ref: '#/definitions/ErrorObject'
 */
/**
 * @swagger
 * /parcels:
 *   get:
 *     tags:
 *       - Parcel
 *     description: Returns all ordered parcels
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: ordered parcels data
 *         schema:
 *           $ref: '#/definitions/ResponseObjectParcel'
 *       500:
 *         description: Server error exists
 *         schema:
 *           $ref: '#/definitions/ErrorObject'
 *       401:
 *         description: Authentication error exists
 *         schema:
 *           $ref: '#/definitions/ErrorObject'
 *       403:
 *         description: Authourization error exists
 *         schema:
 *           $ref: '#/definitions/ErrorObject'
 */
/**
 * @swagger
 * /parcels/{id}:
 *   get:
 *     tags:
 *       - Parcel
 *     description: Returns a single parcels
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Parcel's id
 *         in: path
 *         required: true
 *         type: number
 *     responses:
 *       200:
 *         description: a single parcel data
 *         schema:
 *           $ref: '#/definitions/ResponseObjectSingleParcel'
 *       500:
 *         description: Server error exists
 *         schema:
 *           $ref: '#/definitions/ErrorObject'
 *       404:
 *         description: Supplied parcel id incorrect
 *         schema:
 *           $ref: '#/definitions/ErrorObject'
 *       401:
 *         description: Authentication error exists
 *         schema:
 *           $ref: '#/definitions/ErrorObject'
 *       403:
 *         description: Authourization error exists
 *         schema:
 *           $ref: '#/definitions/ErrorObject'
 */
/**
 * @swagger
 * /parcels/{id}/cancel:
 *   patch:
 *     tags:
 *       - Parcel
 *     description: Returns a single parcels
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Parcel's id
 *         in: path
 *         required: true
 *         type: number
 *     responses:
 *       200:
 *         description: cancelled parcel order
 *         schema:
 *           $ref: '#/definitions/UpdateObjectParcel'
 *       500:
 *         description: Server error exists
 *         schema:
 *           $ref: '#/definitions/ErrorObject'
 *       404:
 *         description: Supplied parcel id incorrect
 *         schema:
 *           $ref: '#/definitions/ErrorObject'
 *       401:
 *         description: Authentication error exists
 *         schema:
 *           $ref: '#/definitions/ErrorObject'
 *       403:
 *         description: Authourization error exists
 *         schema:
 *           $ref: '#/definitions/ErrorObject'
 */

/**
 * @swagger
 * /parcels/{id}/destination:
 *   patch:
 *     tags:
 *       - Parcel
 *     description: Returns a single parcels
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Parcel's id
 *         in: path
 *         required: true
 *         type: number
 *       - name: toLocation
 *         description: destination address
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - toLocation
 *           properties:
 *             toLocation:
 *               type: string
 *     responses:
 *       200:
 *         description: changed parcel description
 *         schema:
 *           $ref: '#/definitions/UpdateObjectParcel'
 *       500:
 *         description: Server error exists
 *         schema:
 *           $ref: '#/definitions/ErrorObject'
 *       404:
 *         description: Supplied parcel id incorrect
 *         schema:
 *           $ref: '#/definitions/ErrorObject'
 *       401:
 *         description: Authentication error exists
 *         schema:
 *           $ref: '#/definitions/ErrorObject'
 *       403:
 *         description: Authourization error exists
 *         schema:
 *           $ref: '#/definitions/ErrorObject'
 */

/**
 * @swagger
 * /parcels/{id}/status:
 *   patch:
 *     tags:
 *       - Parcel
 *     description: Changes a parcel's status
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Parcel's id
 *         in: path
 *         required: true
 *         type: number
 *       - name: status
 *         description: parcel status
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - status
 *           properties:
 *             status:
 *               type: string
 *     responses:
 *       200:
 *         description: changed parcel description
 *         schema:
 *           $ref: '#/definitions/StatusObjectParcel'
 *       500:
 *         description: Server error exists
 *         schema:
 *           $ref: '#/definitions/ErrorObject'
 *       404:
 *         description: Supplied parcel id incorrect
 *         schema:
 *           $ref: '#/definitions/ErrorObject'
 *       401:
 *         description: Authentication error exists
 *         schema:
 *           $ref: '#/definitions/ErrorObject'
 *       403:
 *         description: Authourization error exists
 *         schema:
 *           $ref: '#/definitions/ErrorObject'
 */
/**
 * @swagger
 * /parcels/{id}/currentlocation:
 *   patch:
 *     tags:
 *       - Parcel
 *     description: Changes a parcel's currentLocation
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Parcel's id
 *         in: path
 *         required: true
 *         type: number
 *       - name: currentLocation
 *         description: parcel currentlocation
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - currentLocation
 *           properties:
 *             currentLocation:
 *               type: string
 *     responses:
 *       200:
 *         description: changed parcel currentLocation
 *         schema:
 *           $ref: '#/definitions/CurrentLocationObjectParcel'
 *       500:
 *         description: Server error exists
 *         schema:
 *           $ref: '#/definitions/ErrorObject'
 *       404:
 *         description: Supplied parcel id or currentLocation incorrect
 *         schema:
 *           $ref: '#/definitions/ErrorObject'
 *       401:
 *         description: Authentication error exists
 *         schema:
 *           $ref: '#/definitions/ErrorObject'
 *       403:
 *         description: Authourization error exists
 *         schema:
 *           $ref: '#/definitions/ErrorObject'
 */
/**
 * @swagger
 * /users/{id}/parcels:
 *   get:
 *     tags:
 *       - Parcel
 *     description: Returns a single parcels
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: User's id
 *         in: path
 *         required: true
 *         type: number
 *     responses:
 *       200:
 *         description: a single parcel data
 *         schema:
 *           $ref: '#/definitions/ResponseObjectParcel'
 *       500:
 *         description: Server error exists
 *         schema:
 *           $ref: '#/definitions/ErrorObject'
 *       404:
 *         description: Supplied parcel id incorrect
 *         schema:
 *           $ref: '#/definitions/ErrorObject'
 *       401:
 *         description: Authentication error exists
 *         schema:
 *           $ref: '#/definitions/ErrorObject'
 *       403:
 *         description: Authorization error exists
 *         schema:
 *           $ref: '#/definitions/ErrorObject'
 */
