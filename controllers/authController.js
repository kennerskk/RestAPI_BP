import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getUser } from '../models/user_schema.js';

export const login = async (req, res) => {
  const User = getUser();
  if (!User) {
    console.error('User model not initialized');
    return res.status(500).json({ message: 'Server misconfiguration: User model not initialized' });
  }

  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ message: 'username and password required' });

  try {
    // Sequelize style
    let user = null;
    try {
      user = await User.findOne({ where: { username } });
    } catch (e) {
      // fallback signature
      user = await User.findOne({ username }).catch(() => null);
    }

    if (!user) return res.status(400).json({ message: 'ไม่พบผู้ใช้งาน' });

    const storedPassword = user.password ?? user.dataValues?.password;
    if (!storedPassword) return res.status(500).json({ message: 'User password not found' });

    const isMatch = await bcrypt.compare(password, storedPassword);
    if (!isMatch) return res.status(400).json({ message: 'ไม่ตรง' });

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not set');
      return res.status(500).json({ message: 'Server misconfiguration' });
    }

    const userId = user.id ?? user.dataValues?.id ?? user._id;
    const token = jwt.sign({ user: { id: userId } }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
