import pg from 'pg';

const { Pool } = pg;
let connectionData;

if (process.env.NODE_ENV === 'prod') {
  connectionData = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  };
} else {
  connectionData = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
  };
}
const connection = new Pool(connectionData);

export default connection;
