import { Client } from 'pg';
import { connectionString } from '../../config/postgres-config';
import userDb from './users';
import parcelDb from './parcels';

const config = connectionString;
console.log(config, 'no config');
const makeQuery = (query) => {
  const client = new Client(config);
  client.connect();
  console.log('connection successful');
  client.query(query)
    .then((res) => {
      console.log(res);
      client.end();
    })
    .catch((err) => {
      console.log(err);
      client.end();
    });
};
makeQuery(`${userDb}${parcelDb}`);
