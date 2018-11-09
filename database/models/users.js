const userModel = `
  DROP TABLE IF EXISTS aUsers CASCADE;
  CREATE TABLE aUsers (
      id serial PRIMARY KEY,
      firstName VARCHAR(255) NOT NULL,
      lastName VARCHAR(255) NOT NULL,
      otherNames VARCHAR(255) NOT NULL,
      username VARCHAR(255) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      isAdmin Boolean NOT NULL DEFAULT False,
      registered TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`;

const userDb = `${userModel}`;

export default userDb;
