import connection from '../../src/database/database';

export default async function cleanDatabase() {
  await connection.query('TRUNCATE users CASCADE;');
  await connection.query('TRUNCATE sessions CASCADE;');
}
