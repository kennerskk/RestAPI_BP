import express from 'express';
import Stat from '../models/Stat.js';

const router = express.Router();

// ✅ POST /api/stat/add — เพิ่มข้อมูลใหม่
router.post('/add', async (req, res) => {
  try {
    const { timestamp, value } = req.body;

    if (!timestamp || value === undefined) {
      return res.status(400).json({ error: 'Missing timestamp or value' });
    }

    const newStat = new Stat({ timestamp, value });
    await newStat.save();

    res.status(201).json({ message: 'Stat added', stat: newStat });
  } catch (error) {
    console.error('Error adding stat:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ✅ GET /api/stat — ดึงข้อมูลทั้งหมด
router.get('/', async (req, res) => {
  try {
    const stats = await Stat.find().sort({ createdAt: -1 });
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
