import bcrypt from 'bcrypt';
import connection from '../database/database.js';
import { signUpSchema } from '../schemas/usersSchemas.js';

// eslint-disable-next-line consistent-return
export default async function signUp(req, res) {
  try {
    const {
      name,
      email,
      password,
      cpf,
      phone,
    } = req.body;

    const validationResult = signUpSchema.validate(req.body, { abortEarly: false });

    if (validationResult.error) {
      return res.status(400).send(validationResult.error.details[0].message);
    }

    const hasUser = await connection.query(
      `SELECT * FROM users
        WHERE email = $1 OR phone = $2 OR cpf = $3;`,
      [email, phone, cpf],
    );
    if (hasUser.rowCount > 0) {
      return res.status(409).send('Usuário já existente.');
    }

    const hashPassword = bcrypt.hashSync(password, 10);

    await connection.query(
      `INSERT INTO users (name, email, password, cpf, phone)
        VALUES ($1, $2, $3, $4, $5);`,
      [name, email, hashPassword, cpf, phone],
    );

    res.status(201).send('Conta criada com sucesso.');
  } catch {
    res.status(500);
  }
}
