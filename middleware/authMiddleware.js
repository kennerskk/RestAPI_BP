import jwt from 'jsonwebtoken';
import { getUser } from '../models/user_schema.js';

export const protect = async (req, res, next) => {
  try {
    const authHeader =
      req.headers.authorization ||
      (req.cookies && req.cookies.token);

    let token;
    if (authHeader && authHeader.startsWith?.('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else {
      token = authHeader;
    }

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const User = getUser();
    if (!User) {
      console.error('User model not initialized');
      return res.status(500).json({ message: 'Server error' });
    }

    const user = await User.findByPk(decoded.user.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};
