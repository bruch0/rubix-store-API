/* eslint-disable consistent-return */
/* eslint-disable comma-dangle */
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';
import connection from '../database/database.js';
import signInSchema from '../schemas/usersSchemas.js';

export default async function postSignIn(req, res) {
  try {
    const { email, password } = req.body;

    if ((signInSchema.validate(req.body)).error) {
      return res.status(400).send('Dados inválidos');
    }

    const hasUser = await connection.query(
      'SELECT * FROM users WHERE email = $1;',
      [email],
    );

    const user = hasUser.rows[0];

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = uuid();
      await connection.query(
        `INSERT INTO sessions 
        ("userId", token)
        VALUES ($1, $2);`,
        [user.id, token]
      );

      res.status(200).send({
        userId: user.id,
        name: user.name,
        email,
        token,
      });
    } else {
      res.status(401).send('E-mail ou senha inválidos');
    }
  } catch (error) {
    console.log(error);
    res.status(500);
  }
}
