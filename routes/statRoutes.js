import express from 'express';
import Stat from '../models/stat_schema.js';

const router = express.Router();

// ✅ POST /api/stat/add — เพิ่มข้อมูลใหม่
router.post('/add', async (req, res) => {
  try {
    const { timestamp, value, topic_name, experiment_id, session_id, data } = req.body;

    if (!timestamp) {
      return res.status(400).json({ error: 'Missing timestamp' });
    }

    const newStat = new Stat({
      timestamp,
      value,
      topic_name,
      experiment_id,
      session_id,
      data
    });

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
