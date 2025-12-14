import express from 'express';
// 👉 สำคัญ: Import แบบ Named Import { Stat } (มีปีกกา) เพื่อให้ได้รับค่าตัวแปรที่อัปเดตแล้วจาก Model
import { Stat } from '../models/stat_schema.js';
import { Op } from 'sequelize'; 
import { protect } from '../middleware/authMiddleware.js'; // เปิดใช้ถ้าต้องการ Auth Middleware
const path = require('path');
const { fileURLToPath } = require('url');

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

router.delete('/delete-session', async (req, res) => {
  try {
    // รับค่าจาก Body
    const { session_id, experiment_id } = req.body;

    // เช็คว่าส่งค่ามาครบไหม
    if (session_id === undefined || experiment_id === undefined) {
      return res.status(400).json({ 
        error: 'Missing required fields: session_id and experiment_id are required.' 
      });
    }

    if (!Stat) {
        throw new Error('Stat model has not been initialized in server.js');
    }

    // 🔥 คำสั่งลบ: ใช้ Op.contains เพื่อหาว่าแถวไหนมี JSON หน้าตาแบบนี้บ้าง
    const deletedCount = await Stat.destroy({
      where: {
        data: {
          [Op.contains]: {
            // ต้องแปลงเป็น Number เพื่อให้ตรงกับชนิดข้อมูลใน JSON (ถ้าใน DB เก็บเป็นเลข)
            session_id: Number(session_id),
            experiment_id: Number(experiment_id)
          }
        }
      }
    });

    if (deletedCount === 0) {
      return res.status(404).json({ message: 'No records found to delete matching criteria.' });
    }

    res.json({ 
      message: 'Successfully deleted records', 
      deleted_count: deletedCount,
      criteria: { session_id, experiment_id }
    });

  } catch (err) {
    console.error('Error deleting stats:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// GET: serve frontend page (calls frontend/index.html)
router.get('/view', async (req, res) => {
  try {
    const indexPath = path.join(__dirname, '..', '..', 'frontend', 'index.html');
    return res.sendFile(indexPath);
  } catch (err) {
    console.error('Error sending frontend page:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

export default router;