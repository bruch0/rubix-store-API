import connection from '../../src/database/database';

export default async function clearDatabase() {
  await connection.query('TRUNCATE sessions, cart, products, users, products_brands, categories CASCADE;');
}
