import express from 'express';
import { login } from '../controllers/authController.js';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// ESM __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve login page at GET /login
router.get('/login', (req, res) => {
  try {
    const loginPath = path.join(__dirname, '..', 'frontend', 'login.html');
    console.log(`Serving login page: ${loginPath}`);
    return res.sendFile(loginPath);
  } catch (err) {
    console.error('Error sending login page:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', login);

export default router;
