// routes/statRoutes.js
import express from 'express';
import Stat from '../models/stat_schema.js';

const router = express.Router();

router.post('/add', async (req, res) => {
  try {
    const newStat = new Stat(req.body); // รับทุกอย่าง

    await newStat.save();

    res.status(201).json({ message: 'Stat added', stat: newStat });

  } catch (err) {
    console.error('Error adding stat:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const stats = await Stat.find().sort({ createdAt: -1 });
    res.json(stats);
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
