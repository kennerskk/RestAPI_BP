import jwt from 'jsonwebtoken';
import User from '../models/user_schema.js';

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || (req.cookies && req.cookies.token);
    let token;
    if (authHeader && authHeader.startsWith && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else {
      token = authHeader;
    }

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Try different retrieval styles to support Sequelize or other ORMs
    let user = null;
    if (User.findByPk) {
      try { user = await User.findByPk(decoded.user.id); } catch {}
    }
    if (!user && User.findOne) {
      try {
        user = await User.findOne({ where: { id: decoded.user.id } });
        if (!user) user = await User.findOne({ id: decoded.user.id });
      } catch {}
    }
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
