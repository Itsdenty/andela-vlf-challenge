/**
 * @swagger
 * securityDefinitions:
 *   Bearer:
 *     type: apiKey
 *     name: Authorization
 *     in: header
 * definition:
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
 *         type: string
 *   ResponseObjectSingleParcel:
 *     properties:
 *       status:
 *         type: number
 *       data:
 *         $ref: '#/definitions/ParcelResponse'
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
 * /parcels:
 *   post:
 *     tags:
 *       - User
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
 *           $ref: '#/definitions/ResponseObjectSingle'
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
