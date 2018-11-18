const queries = {};
queries.createUser = `INSERT INTO aUsers (firstName, lastName, otherNames, username, email, password, isAdmin)
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING *`;
queries.findOneUser = `SELECT * FROM aUsers
                        WHERE email = $1`;
queries.values = user => [user.firstName, user.lastName, user.otherNames,
  user.username, user.email, user.password, user.isAdmin];

export default queries;
