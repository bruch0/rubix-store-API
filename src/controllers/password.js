import sendgridMail from '@sendgrid/mail';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';
import { passwordRecoverySchema } from '../schemas/passwordRecovery.js';
import connection from '../database/database.js';

const sendRecoveryMail = async (req, res) => {
  const { email } = req.body;

  const validationResult = passwordRecoverySchema.validate(req.body, { abortEarly: false });
  if (validationResult.error) {
    res.status(400).send(validationResult.error.details[0].message);
    return;
  }

  const result = await connection.query('SELECT * FROM users WHERE email = $1', [email]);
  if (result.rowCount === 0) {
    res.status(404).send('Email não encontrado');
    return;
  }
  const userId = result.rows[0].id;
  const token = uuid();
  const link = process.env.NODE_ENV === 'prod' ? 'https://rubix-store.vercel.app/' : 'http://localhost:3000/';

  try {
    await connection.query('INSERT INTO recovery_password (user_id, token, creation_date) VALUES ($1, $2, $3)', [userId, token, Date.now()]);
    sendgridMail.setApiKey(process.env.SENGRID_API_KEY);
    const mailMessage = `
        <h1>Para recuperar sua senha, clique no link abaixo<h1>
        <a href="${link}recover?token=${token}"">Clique aqui</a>
        <h5>Se você não solicitou esse e-mail, desconsidere-o</h5>
      `;
    const mail = {
      to: email,
      from: 'rubix.store.oficial@gmail.com', // Use the email address or domain you verified above
      subject: 'Recuperação de senha',
      html: mailMessage,
    };

    sendgridMail.send(mail);
    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
};

const authorizePasswordRoute = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    res.status(401).send('Sem token');
    return;
  }

  try {
    const result = await connection.query('SELECT recovery_password.*, users.email AS "userEmail" FROM recovery_password JOIN users ON recovery_password.user_id = users.id WHERE recovery_password.token = $1', [token]);
    if (result.rowCount === 0) {
      res.status(404).send('Token não encontrado');
      return;
    }

    const time = result.rows[0].creation_date;
    const milisecondsToMinutes = 60000;
    // eslint-disable-next-line radix
    const minutesSinceCreation = parseInt((Date.now() - time) / milisecondsToMinutes);
    if (minutesSinceCreation >= 15) {
      res.status(408).send('Token expirado');
      return;
    }

    res.status(200).send(result.rows);
  } catch {
    res.sendStatus(500);
  }
};

const changePassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!newPassword || newPassword.length < 8) {
    res.status(400).send('A senha deve conter no mínimo 8 caractéres');
    return;
  }

  try {
    const hash = bcrypt.hashSync(newPassword, 10);
    console.log(newPassword, email);
    await connection.query(`UPDATE users SET password = $1 WHERE email = '${email}'`, [hash]);
    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
};

export {
  sendRecoveryMail,
  authorizePasswordRoute,
  changePassword,
};
