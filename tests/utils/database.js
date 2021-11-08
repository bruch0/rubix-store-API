import connection from '../../src/database/database';

export default async function cleanDatabase() {
  await connection.query('TRUNCATE users RESTART IDENTITY');
  await connection.query('TRUNCATE sessions RESTART IDENTITY');
}
