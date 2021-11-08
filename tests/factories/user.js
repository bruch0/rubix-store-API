import faker from 'faker/locale/pt_BR.js';
import bcrypt from 'bcrypt';
import cpf from '@fnando/cpf';
import connection from '../../src/database/database.js';

export default async function createUser() {
  const password = faker.internet.password(8);
  const hash = bcrypt.hashSync(password, 10);

  const newUser = await connection.query(
    `INSERT INTO users (name, email, password, cpf, phone)
    VALUES ($1, $2, $3)
    RETURNING email, password;`,
    [
      faker.name.findName(),
      faker.internet.email(),
      hash,
      cpf.generate(),
      faker.phone.phoneNumber('###########'),
    ],
  );
  newUser.rows[0].password = password;
  return newUser.rows[0];
}
