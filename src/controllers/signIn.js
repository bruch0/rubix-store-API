/* eslint-disable consistent-return */
/* eslint-disable comma-dangle */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connection from '../database/database.js';
import { signInSchema } from '../schemas/usersSchemas.js';

export default async function signIn(req, res) {
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
      const session = await connection.query(
        `INSERT INTO sessions 
        (user_id) VALUES ($1)
        RETURNING id;`,
        [user.id]
      );

      const token = jwt.sign({
        sessionId: session.rows[0].id,
      }, process.env.JWT_SECRET, { expiresIn: 3600 * 48 });

      res.status(200).send({
        userId: user.id,
        name: user.name,
        email: user.email,
        cpf: user.cpf,
        phone: user.phone,
        token
      });
    } else {
      res.status(401).send('E-mail ou senha inválidos');
    }
  } catch (error) {
    res.sendStatus(500);
  }
}
