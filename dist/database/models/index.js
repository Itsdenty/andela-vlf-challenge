'use strict';

var _pg = require('pg');

var _postgresConfig = require('../../config/postgres-config');

var _users = require('./users');

var _users2 = _interopRequireDefault(_users);

var _parcels = require('./parcels');

var _parcels2 = _interopRequireDefault(_parcels);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = _postgresConfig.connectionString;
console.log(config, 'no config');
var makeQuery = function makeQuery(query) {
  var client = new _pg.Client(config);
  client.connect();
  console.log('connection successful');
  client.query(query).then(function (res) {
    console.log(res);
    client.end();
  }).catch(function (err) {
    console.log(err);
    client.end();
  });
};
makeQuery('' + _users2.default + _parcels2.default);