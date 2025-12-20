import dotenv from 'dotenv';
import express from 'express';
import { Sequelize } from 'sequelize';
import cors from 'cors';
import { initUserModel, createAdminUser } from './models/user_schema.js';
import { initStatModel } from './models/stat_schema.js';
import statRoutes from './routes/statRoutes.js';
import authRoutes from './routes/authRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(cors());
app.use(express.json());
// serve frontend
app.use('/ken-api', express.static(path.join(__dirname, 'frontend')));

dotenv.config();



const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL not set.');
    process.exit(1);
}

// 1. สร้าง Sequelize Instance
const sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    logging: false, // ปิดการแสดงผล SQL queries ใน log (เปิดเป็น true ถ้าต้องการ debug)
});

// 2. Initialize Models (จุดสำคัญ! ต้องทำก่อน connectDB)
// ส่ง sequelize instance เข้าไปเพื่อให้ Model ทำงานได้และตัวแปร Stat ได้รับค่า
initUserModel(sequelize); 
initStatModel(sequelize); // <--- ต้องเรียกตรงนี้ Stat ถึงจะไม่ undefined ใน Routes

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to PostgreSQL');
        
        // Sync ตาราง (สร้างตารางถ้ายังไม่มี)
        // force: false หมายถึงข้อมูลเก่าจะไม่หาย
        await sequelize.sync({ force: false }); 
        console.log('✅ All models were synchronized successfully.');

        // สร้าง Admin (ถ้ามี logic นี้)
        await createAdminUser(); 

    } catch (error) {
        console.error('❌ Database connection error:', error.message);
        process.exit(1);
    }
};

// เริ่มเชื่อมต่อ Database
connectDB();

// 3. ใช้งาน Routes
app.use('/ken-api/api/stat', statRoutes);
app.use('/ken-api/api/auth', authRoutes);

// Health Check
app.get('/', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server listening on port ${PORT}`);
});