import express from 'express';
// 👉 แก้ไข: ใช้ import สำหรับ path และ fileURLToPath ให้ถูกต้องตาม ESM
import path from 'path'; 
import { fileURLToPath } from 'url'; 
import { Op } from 'sequelize'; 
import { Stat } from '../models/stat_schema.js';
// import { protect } from '../middleware/authMiddleware.js'; // เปิดใช้ถ้าต้องการ Auth Middleware

const router = express.Router();

// การหา __dirname และ __filename ใน Node.js (ESM Module)
// ต้องทำแบบนี้ เพื่อให้สามารถใช้ path.join ได้อย่างถูกต้อง
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// POST: เพิ่มข้อมูลสถิติใหม่
// Endpoint: /api/stat/add
router.post('/add', async (req, res) => {
    // ... (โค้ดเดิม) ...
    try {
        if (!Stat) {
            throw new Error('Stat model has not been initialized in server.js');
        }
        const newStat = await Stat.create({
            data: req.body 
        });
        res.status(201).json({ message: 'Stat added', stat: newStat });
    } catch (err) {
        console.error('Error adding stat:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
});

// GET: ดึงข้อมูลสถิติทั้งหมด
// Endpoint: /api/stat/
router.get('/', async (req, res) => {
    // ... (โค้ดเดิม) ...
    try {
        if (!Stat) {
            throw new Error('Stat model has not been initialized in server.js');
        }
        const stats = await Stat.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(stats);
    } catch (err) {
        console.error('Error fetching stats:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
}); 

// DELETE: ลบข้อมูลตาม session_id และ experiment_id
router.delete('/delete-session', async (req, res) => {
    // ... (โค้ดเดิม) ...
    try {
        const { session_id, experiment_id } = req.body;
        if (session_id === undefined || experiment_id === undefined) {
            return res.status(400).json({ 
                error: 'Missing required fields: session_id and experiment_id are required.' 
            });
        }
        if (!Stat) {
            throw new Error('Stat model has not been initialized in server.js');
        }

        const deletedCount = await Stat.destroy({
            where: {
                data: {
                    [Op.contains]: {
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

// GET: Serve frontend page (calls frontend/index.html)
// Endpoint: /api/stat/view
router.get('/view', async (req, res) => {
    try {
        // Path จะเป็น: /usr/src/app/routes/statRoutes.js
        // เราต้องการ: /usr/src/app/frontend/index.html
        // ดังนั้นต้องย้อนกลับไป 2 ระดับ ('..', '..') แล้วเข้า 'frontend'
        const indexPath = path.join(__dirname,  '..', 'frontend', 'index.html');
        console.log(`Attempting to serve file from: ${indexPath}`); // Log เพื่อ Debug
        return res.sendFile(indexPath);
    } catch (err) {
        console.error('Error sending frontend page:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
});

export default router;