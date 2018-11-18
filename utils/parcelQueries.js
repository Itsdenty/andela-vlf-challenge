const queries = {};

queries.createParcel = `INSERT INTO bParcels (placedBy, weight, weightmetric, sentOn, status, fromLocation, toLocation)
                        VALUES ($1, $2, $3, $4, $5, $6, $7)
                        RETURNING *`;
queries.findOneUser = `SELECT * FROM aUsers
                        WHERE email = $1`;
queries.getAllParcels = 'SELECT * from bParcels';
queries.getOne = `SELECT * from bParcels 
                  where id=$1`;
queries.getSingleParcel = `SELECT * from bParcels
                            where id=$1 AND placedBy=$2`;
queries.changeStatus = `UPDATE bParcels
                        SET status=$1
                        WHERE id=$2`;
queries.changeDestination = `UPDATE bParcels
                        SET toLocation=$1
                        WHERE id=$2`;
queries.parcelUser = `SELECT p.id, u.email, u.username
                      FROM bParcels p
                      JOIN aUsers u ON p.placedBy=u.id
                      WHERE p.id=$1`;
queries.deliverParcel = `UPDATE bParcels 
                          SET status=$1, deliveredOn=$2
                          WHERE id=$3`;
queries.changeLocation = `UPDATE bParcels 
                          SET currentLocation=$1
                          WHERE id=$2`;
queries.userParcels = `SELECT * from bParcels 
                        where placedBy=$1`;
queries.values = parcel => [parcel.placedBy, parcel.weight, parcel.weightmetric,
  parcel.sentOn, parcel.status, parcel.fromLocation, parcel.toLocation];
export default queries;
