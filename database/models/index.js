import { Client } from 'pg';
import config from '../../config/postgres-config';
import userDb from './users';
import parcelDb from './parcels';

console.log(config);
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
