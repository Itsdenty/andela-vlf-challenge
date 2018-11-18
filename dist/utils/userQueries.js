"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var queries = {};
queries.createUser = "INSERT INTO aUsers (firstName, lastName, otherNames, username, email, password, isAdmin)\n  VALUES ($1, $2, $3, $4, $5, $6, $7)\n  RETURNING *";
queries.findOneUser = "SELECT * FROM aUsers\n                        WHERE email = $1";
queries.values = function (user) {
  return [user.firstName, user.lastName, user.otherNames, user.username, user.email, user.password, user.isAdmin];
};

exports.default = queries;