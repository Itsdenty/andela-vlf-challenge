'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pg = require('pg');

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _postgresConfig = require('../../config/postgres-config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hashedPassword = _bcrypt2.default.hashSync('ispassword', 10);

var sql = 'INSERT INTO aUsers (firstname, lastname, otherNames, username, email, isAdmin, password) VALUES($1,$2,$3,$4,$5,$6,$7)';

var data1 = ['abd-afeez', 'abd-hamid', 'damola', 'coding-muse', 'coding-muse@gmail.com', true, hashedPassword];

var data2 = ['gwen', 'gbenga', 'deji', 'bigdeji', 'dabigi@gmail.com', false, hashedPassword];

var client = new _pg.Client(_postgresConfig.connectionString);
var client2 = new _pg.Client(_postgresConfig.connectionString);
var userSeeder = function userSeeder() {
  client.connect();
  client2.connect();
  client.query(sql, data1, function (err) {
    if (err) {
      client.end();
      console.log(err.stack);
    } else {
      client.end();
      console.log('user inserted');
    }
  });

  client2.query(sql, data2, function (err) {
    if (err) {
      client2.end();
      console.log(err.stack);
    } else {
      client2.end();
      console.log('user inserted');
    }
  });
};

exports.default = userSeeder;