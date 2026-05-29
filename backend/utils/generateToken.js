import jwt from 'jsonwebtoken';

const generateToken = (userId, role) => {
  const payload = { id: userId };
  if (role) payload.role = role;
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

export default generateToken;
