'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('dotenv/config');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _pg = require('pg');

var _pg2 = _interopRequireDefault(_pg);

var _postgresConfig = require('./config/postgres-config');

var _postgresConfig2 = _interopRequireDefault(_postgresConfig);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)(),
    pool = new _pg2.default.Pool(_postgresConfig2.default),
    port = process.env.PORT;

// logger
app.use((0, _morgan2.default)('dev'));

// 3rd party middleware
app.use((0, _cors2.default)());

app.use(_bodyParser2.default.json());

app.use('/api-docs', _express2.default.static(_path2.default.join(__dirname, '../public/api-docs')));

//use the defined routes
app.use('/', _routes2.default);

// connect to db
// initializeDb( db => {

// // internal middleware
// app.use(middleware({ config, db }));

// // api router
// app.use('/api', api({ config, db }));

// app.get('/api/v1', (req, res) => {
//   res.send({msg: 'welcome'});
// });

app.get('/pool', function (req, res) {
  pool.connect(function (err, client, done) {
    if (err) {
      console.log("not able to get connection " + err);
      res.status(400).send(err);
      console.log(err);
    } else {
      console.log('successfully connected');
    }
  });
});

app.listen(port || 3000, function () {
  console.log('Started on port ' + port);
});
// });

exports.default = app;