/* eslint-disable consistent-return */
import jwt from 'jsonwebtoken';

export default async function authenticationJWT(req, res, next) {
  const token = req.headers['x-access-token'];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(401);
    req.sessionId = decoded.sessionId;
    next();
  });
}
