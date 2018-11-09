'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('dotenv/config');

var config = {
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
  max: process.env.POSTGRES_MAX, // max number of connection can be open to database
  idleTimeoutMillis: process.env.POSTGRES_IDLE_TIMEOUT_MILLIS // how long a client is allowed to remain idle before being closed
};

exports.default = config;