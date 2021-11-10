import faker from 'faker-br';
import bcrypt from 'bcrypt';
import connection from '../../src/database/database.js';

export default async function createUser() {
  const password = faker.internet.password(8);
  const hash = bcrypt.hashSync(password, 10);

  const newUser = await connection.query(
    `INSERT INTO users (name, email, password, cpf, phone)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING email, password;`,
    [
      faker.name.findName(),
      faker.internet.email(),
      hash,
      faker.br.cpf(),
      faker.phone.phoneNumber('###########'),
    ],
  );

  newUser.rows[0].password = password;
  return newUser.rows[0];
}
