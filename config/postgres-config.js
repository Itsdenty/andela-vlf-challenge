import dotenv from 'dotenv';

dotenv.config();
export const config = {
  development: {
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    dialect: 'postgres',
  },
  test: {
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || '',
    database: process.env.POSTGRES_TEST_DATABASE || 'travis',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || '5432',
    dialect: 'postgres',
  },
  production: {
    use_env_variable: process.env.DATABASE_URL,
  },
};
let setConnectionString;
const env = process.env.NODE_ENV || 'development';
if (env === 'production') setConnectionString = { connectionString: process.env.DATABASE_URL, ssl: true };
else setConnectionString = config[env];
export const connectionString = setConnectionString;
