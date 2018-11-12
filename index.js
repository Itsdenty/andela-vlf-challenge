import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import path from 'path';
import pg from 'pg';
import validator from 'express-validator';
import dbConfig from './config/postgres-config';
import routes from './routes';
import customValidator from './middlewares/validators/custom-validator';
import customSanitizer from './middlewares/validators/custom-sanitizer';
import transformer from './utils/transformer';


const app = express(),
  pool = new pg.Pool(dbConfig),
  port = process.env.PORT;

// logger
app.use(morgan('dev'));

// configure validator
app.use(validator({ customValidators: customValidator, customSanitizers: customSanitizer }));

// 3rd party middleware
app.use(cors());

app.use(bodyParser.json());

app.use('/api-docs', express.static(path.join(__dirname, '../public/api-docs')));

// use the defined routes
app.use('/', routes);

// // error handler
// app.use((err, req, res) => {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.send(transformer.transformResponse(500, err));
// });

app.get('/pool', (req, res) => {
  pool.connect((err) => {
    if (err) {
      console.log(`not able to get connection ${err}`);
      res.status(400).send(err);
      console.log(err);
    } else {
      console.log('successfully connected');
    }
  });
});


app.listen(port || 3000, () => {
  console.log(`Started on port ${port}`);
});
// });

export default app;
