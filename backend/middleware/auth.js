import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { normalizeRole } from '../utils/authHelpers.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'User not found' });
    if (user.isBlocked) return res.status(403).json({ message: 'Account is blocked' });
    user.role = normalizeRole(user.role);
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};

export const authorize = (...roles) => (req, res, next) => {
  const allowed = roles.flat().map((r) => (r === 'worker' ? 'labour' : r));
  const userRole = req.user.role === 'worker' ? 'labour' : req.user.role;
  if (!allowed.includes(userRole)) {
    return res.status(403).json({ message: `Role ${userRole} not authorized` });
  }
  next();
};
