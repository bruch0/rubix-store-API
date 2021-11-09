/* eslint-disable consistent-return */
/* eslint-disable comma-dangle */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connection from '../database/database.js';
import { signInSchema } from '../schemas/usersSchemas.js';

export default async function postSignIn(req, res) {
  try {
    const { email, password } = req.body;

    const validationResult = signInSchema.validate(req.body, { abortEarly: false });

    if (validationResult.error) {
      return res.status(400).send(validationResult.error.details[0].message);
    }

    const selectedUser = await connection.query(
      'SELECT * FROM users WHERE email = $1;',
      [email]
    );

    const user = selectedUser.rows[0];

    if (user && bcrypt.compareSync(password, user.password)) {
      const data = {
        userId: user.id,
        name: user.name,
        email: user.email,
        cpf: user.cpf,
        phone: user.phone
      };

      const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: 60 * 60 });

      await connection.query(
        `INSERT INTO sessions 
        (user_id, token)
        VALUES ($1, $2);`,
        [user.id, token]
      );

      res.status(200).send({ auth: true, token });
    } else {
      res.status(401).send('E-mail ou senha inválidos');
    }
  } catch (error) {
    res.status(500);
  }
}
