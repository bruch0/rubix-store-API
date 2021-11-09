import pg from 'pg';

const { Pool } = pg;
let connectionData;

if (process.NODE_ENV === 'prod') {
  connectionData = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  };
} else if (process.NODE_ENV === 'dev') {
  connectionData = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
  };
} else {
  connectionData = {
    user: 'postgres',
    password: '123456',
    port: 5432,
    host: 'localhost',
    database: 'rubixstore_test',
  };
}

const connection = new Pool(connectionData);

export default connection;
