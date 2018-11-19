'use strict';

Object.defineProperty(exports, "__esModule", {
                        value: true
});
var queries = {};

queries.createParcel = 'INSERT INTO bParcels (placedBy, weight, weightmetric, sentOn, status, fromLocation, toLocation)\n                        VALUES ($1, $2, $3, $4, $5, $6, $7)\n                        RETURNING *';
queries.findOneUser = 'SELECT * FROM aUsers\n                        WHERE email = $1';
queries.getAllParcels = 'SELECT * from bParcels';
queries.getOne = 'SELECT * from bParcels \n                  where id=$1';
queries.getSingleParcel = 'SELECT * from bParcels\n                            where id=$1 AND placedBy=$2';
queries.changeStatus = 'UPDATE bParcels\n                        SET status=$1\n                        WHERE id=$2';
queries.changeDestination = 'UPDATE bParcels\n                        SET toLocation=$1\n                        WHERE id=$2';
queries.parcelUser = 'SELECT p.id, u.email, u.username\n                      FROM bParcels p\n                      JOIN aUsers u ON p.placedBy=u.id\n                      WHERE p.id=$1';
queries.deliverParcel = 'UPDATE bParcels \n                          SET status=$1, deliveredOn=$2\n                          WHERE id=$3';
queries.changeLocation = 'UPDATE bParcels \n                          SET currentLocation=$1\n                          WHERE id=$2';
queries.userParcels = 'SELECT * from bParcels\n                        where placedBy=$1';
queries.values = function (parcel) {
                        return [parcel.placedBy, parcel.weight, parcel.weightmetric, parcel.sentOn, parcel.status, parcel.fromLocation, parcel.toLocation];
};
exports.default = queries;