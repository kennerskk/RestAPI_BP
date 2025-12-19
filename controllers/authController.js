import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getUser } from '../models/user_schema.js';

export const login = async (req, res) => {
  const User = getUser();
  if (!User) {
    console.error('User model not initialized');
    return res.status(500).json({ message: 'Server misconfiguration' });
  }

  // 1) Validate input
  const username = req.body?.username?.trim();
  const password = req.body?.password?.trim();

  if (!username || !password) {
    return res.status(400).json({ message: 'username and password required' });
  }

  try {
    // 2) Find user
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ message: 'ไม่พบผู้ใช้งาน' });
    }

    // 3) Get hashed password
    const storedPassword = user.password;
    if (!storedPassword) {
      console.error('Password field missing for user:', username);
      return res.status(500).json({ message: 'Server error' });
    }

    // sanity check (bcrypt hash ปกติจะ ~60 chars)
    if (storedPassword.length < 50 || !storedPassword.startsWith('$2')) {
      console.error('Invalid bcrypt hash stored:', storedPassword);
      return res.status(500).json({ message: 'Server error' });
    }

    // 4) Compare password
    const isMatch = await bcrypt.compare(password, storedPassword);
    console.log(`Login attempt: user=${username}, match=${isMatch}`);

    if (!isMatch) {
    console.log(storedPassword);

      return res.status(400).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }

    // 5) Generate JWT
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not set');
      return res.status(500).json({ message: 'Server misconfiguration' });
    }

    const token = jwt.sign(
      { user: { id: user.id } },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({ token });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
