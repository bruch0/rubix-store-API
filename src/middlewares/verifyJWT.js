/* eslint-disable consistent-return */
import jwt from 'jsonwebtoken';

export default async function verifyJWT(req, res, next) {
  const token = req.headers['x-access-token'];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(401);
    req.userId = decoded.userId;
    next();
  });
}
