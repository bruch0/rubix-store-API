import jwt from 'jsonwebtoken';

import createSession from './sessionsFactory';

const createToken = async () => {
  const token = jwt.sign(
    {
      sessionId: await createSession(),
    },
    process.env.JWT_SECRET,
    { expiresIn: 60 * 60 }
  );

  return token;
};

export default createToken;
