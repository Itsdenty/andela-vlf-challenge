const parcelModel = `
  DROP TABLE IF EXISTS bParcels CASCADE;
  CREATE TABLE bParcels (
      id serial PRIMARY KEY,
      placedBy INT NOT NULL,
      weight DECIMAL NOT NULL,
      weightmetric VARCHAR(55) NOT NULL,
      sentOn DATE NOT NULL,
      DeliveredOn DATE NOT NULL
      status VARCHAR(255) NOT NULL,
      from VARCHAR(255) NOT NULL,
      to VARCHAR(255) NOT NULL,
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      foreign key(userId) REFERENCES aUsers(id)
  );
`;

const parcelDb = `${parcelModel}`;

export default parcelDb;
