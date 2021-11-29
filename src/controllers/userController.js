import * as userService from '../services/userService.js';

const signUp = async (req, res) => {
  const { name, email, password, cpf, phone } = req.body;

  if (!name || !email || !password || !cpf || !phone)
    return res.sendStatus(400);

  try {
    const success = await userService.signUp({
      name,
      email,
      password,
      cpf,
      phone,
    });

    if (success === -2) return res.sendStatus(400);
    if (success === -1) return res.sendStatus(409);

    return res.sendStatus(201);
  } catch {
    return res.sendStatus(500);
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.sendStatus(400);

  try {
    const userInfo = await userService.signIn({
      email,
      password,
    });

    if (userInfo === -2) return res.sendStatus(400);
    if (userInfo === -1) return res.sendStatus(401);

    const { userId, name, cpf, phone, token } = userInfo;

    return res.status(200).send({
      userId,
      name,
      cpf,
      phone,
      email,
      token,
    });
  } catch {
    return res.sendStatus(500);
  }
};

const getUserInfo = async (req, res) => {
  const { sessionId } = req;

  try {
    const userInfo = await userService.getUserInfo({ sessionId });

    res.send(userInfo);
  } catch {
    res.sendStatus(500);
  }
};

const requestRecoveryPasswordMail = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.sendStatus(400);

  try {
    const emailSent = await userService.requestRecoveryPasswordMail({ email });

    if (emailSent === -1) return res.sendStatus(400);
    if (emailSent === 0) return res.sendStatus(404);

    return res.sendStatus(200);
  } catch {
    return res.sendStatus(500);
  }
};

const authorizeRecoveryPasswordRoute = async (req, res) => {
  const { token } = req.body;

  if (!token) return res.sendStatus(401);

  try {
    const userEmail = await userService.authorizeRecoveryPasswordRoute({
      token,
    });

    if (userEmail === -1) return res.sendStatus(404);
    if (userEmail === 0) return res.sendStatus(408);

    return res.status(200).send({ userEmail });
  } catch {
    return res.sendStatus(500);
  }
};

const changeUserPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword || newPassword?.length < 8)
    return res.sendStatus(400);

  try {
    await userService.changeUserPassword({ email, newPassword });

    return res.sendStatus(200);
  } catch {
    return res.sendStatus(500);
  }
};

export {
  signUp,
  signIn,
  getUserInfo,
  requestRecoveryPasswordMail,
  authorizeRecoveryPasswordRoute,
  changeUserPassword,
};
