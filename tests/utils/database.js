import connection from '../../src/database/database';

export default async function clearDatabase() {
  await connection.query('TRUNCATE users CASCADE;');
  await connection.query('TRUNCATE sessions CASCADE;');
  await connection.query('TRUNCATE cart;');
}
