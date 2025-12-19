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
    const user = await (async () => {
      try { return await User.findOne({ where: { username } }); } catch (e) { return await User.findOne({ username }).catch(() => null); }
    })();

    if (!user) return res.status(400).json({ message: 'ไม่พบผู้ใช้งาน' });

    const storedPassword = user.password ?? user.dataValues?.password;
    console.log('DEBUG: storedPassword length=', storedPassword?.length, 'startsWith $2=', storedPassword?.startsWith?.('$2'));

    if (!storedPassword) return res.status(500).json({ message: 'User password not found' });
    if ((storedPassword ?? '').length < 50) {
      // very likely truncated / not a valid bcrypt hash
      console.error('Stored password looks invalid/truncated:', storedPassword);
      return res.status(500).json({ message: 'Stored password invalid (possibly truncated or not bcrypt).' });
    }

    const isMatch = await bcrypt.compare(password, storedPassword);
    console.log('DEBUG: bcrypt.compare result =', isMatch);

    if (!isMatch) {
      // hint for common causes
      return res.status(400).json({ message: 'ไม่ตรง (ตรวจสอบว่ารหัสเก็บเป็น bcrypt แบบ plain password ถูก hash ซ้มหรือไม่)' });
    }

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
