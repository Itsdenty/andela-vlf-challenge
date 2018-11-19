import { Client } from 'pg';
import bcrypt from 'bcrypt';
import { connectionString } from '../../config/postgres-config';

const hashedPassword = bcrypt.hashSync('ispassword', 10);

const sql = 'INSERT INTO aUsers (firstname, lastname, otherNames, username, email, isAdmin, password) VALUES($1,$2,$3,$4,$5,$6,$7)';

const data1 = ['abd-afeez', 'abd-hamid', 'damola', 'coding-muse', 'coding-muse@gmail.com', true, hashedPassword];

const data2 = ['gwen', 'gbenga', 'deji', 'bigdeji', 'dabigi@gmail.com', false, hashedPassword];

const client = new Client(connectionString);
const client2 = new Client(connectionString);
const userSeeder = () => {
  client.connect();
  client2.connect();
  client.query(sql, data1, (err) => {
    if (err) {
      client.end();
      console.log(err.stack);
    } else {
      client.end();
      console.log('user inserted');
    }
  });

  client2.query(sql, data2, (err) => {
    if (err) {
      client2.end();
      console.log(err.stack);
    } else {
      client2.end();
      console.log('user inserted');
    }
  });
};

export default userSeeder;
