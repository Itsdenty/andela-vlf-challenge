const parcelModel = `
  DROP TABLE IF EXISTS bParcels CASCADE;
  CREATE TABLE bParcels (
      id serial PRIMARY KEY,
      placedBy INT NOT NULL,
      weight DECIMAL NOT NULL,
      weightmetric VARCHAR(255) NOT NULL,
      status VARCHAR(255) NOT NULL,
      sentOn DATE NOT NULL,
      fromLocation VARCHAR(255) NOT NULL,
      toLocation VARCHAR(255) NOT NULL,
      currentLocation VARCHAR(255),
      deliveredOn DATE,
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      foreign key(placedBy) REFERENCES aUsers(id)
  );
`;

const parcelDb = `${parcelModel}`;

export default parcelDb;
