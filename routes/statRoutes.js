import express from 'express';
// 👉 สำคัญ: Import แบบ Named Import { Stat } (มีปีกกา) เพื่อให้ได้รับค่าตัวแปรที่อัปเดตแล้วจาก Model
import { Stat } from '../models/stat_schema.js';
import { protect } from '../middleware/authMiddleware.js'; // เปิดใช้ถ้าต้องการ Auth Middleware

const router = express.Router();

// POST: เพิ่มข้อมูลสถิติใหม่
// Endpoint: /api/stat/add
router.post('/add', async (req, res) => {
  try {
    // ตรวจสอบความพร้อมของ Model ก่อนใช้งาน
    if (!Stat) {
      throw new Error('Stat model has not been initialized in server.js');
    }

    // บันทึกข้อมูลลง Database
    // ใน PostgreSQL Model เราออกแบบให้มี field ชื่อ 'data' เป็นประเภท JSONB
    // ดังนั้นเราจึงยัด req.body ทั้งก้อนลงไปใน field 'data' ได้เลย
    const newStat = await Stat.create({
        data: req.body 
    });

    res.status(201).json({ message: 'Stat added', stat: newStat });

  } catch (err) {
    console.error('Error adding stat:', err);
    // ส่ง Error details กลับไปเพื่อให้ Debug ง่ายขึ้น
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// GET: ดึงข้อมูลสถิติทั้งหมด
// Endpoint: /api/stat/
// ตัวอย่างการใส่ Auth: router.get('/', protect, async (req, res) => { ... })
router.get('/', async (req, res) => {
  try {
    if (!Stat) {
        throw new Error('Stat model has not been initialized in server.js');
    }

    // ใช้คำสั่ง findAll ของ Sequelize (เทียบเท่า .find() ของ Mongoose)
    const stats = await Stat.findAll({
        order: [['createdAt', 'DESC']] // เรียงจากใหม่ไปเก่า
    });
    
    res.json(stats);

  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}); 

export default router;