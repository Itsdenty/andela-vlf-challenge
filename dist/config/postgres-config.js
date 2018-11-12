'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connectionString = exports.config = undefined;

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();
var config = exports.config = {
  development: {
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    dialect: 'postgres'
  },
  test: {
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_TEST_DATABASE,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    dialect: 'postgres'
  },
  production: {
    use_env_variable: process.env.DATABASE_URL
  }
};
var setConnectionString = void 0;
var env = process.env.NODE_ENV || 'development';
if (env === 'production') setConnectionString = { connectionString: process.env.DATABASE_URL, ssl: true };else setConnectionString = config[env];
var connectionString = exports.connectionString = setConnectionString;