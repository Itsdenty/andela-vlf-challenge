"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var parcelModel = "\n  DROP TABLE IF EXISTS bParcels CASCADE;\n  CREATE TABLE bParcels (\n      id serial PRIMARY KEY,\n      placedBy INT NOT NULL,\n      weight DECIMAL NOT NULL,\n      weightmetric VARCHAR(255) NOT NULL,\n      status VARCHAR(255) NOT NULL,\n      sentOn DATE NOT NULL,\n      fromLocation VARCHAR(255) NOT NULL,\n      toLocation VARCHAR(255) NOT NULL,\n      deliveredOn DATE NOT NULL,\n      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,\n      foreign key(placedBy) REFERENCES aUsers(id)\n  );\n";

var parcelDb = "" + parcelModel;

exports.default = parcelDb;