import express from 'express';
import { Sequelize } from 'sequelize'; // นำเข้า Sequelize แทน
import cors from 'cors';
import dotenv from 'dotenv';
import statRoutes from './routes/statRoutes.js';
import authRoutes from './routes/authRoutes.js';
import User, { initUserModel, createAdminUser } from './models/user_schema.js'; // ปรับการ Import

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
// ใช้ DATABASE_URL แทน MONGO_URI
const DATABASE_URL = process.env.DATABASE_URL; 

if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL not set in environment.');
    process.exit(1);
}

// 1. สร้าง Sequelize Instance
const sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    logging: false, // ปิดการแสดงผล SQL queries
});

// 2. Initialise Models (เรียกใช้งาน Sequelize Models)
// ส่ง Instance ของ Sequelize เข้าไปในไฟล์ Model เพื่อกำหนดตาราง
initUserModel(sequelize); 
// **สมมติว่าคุณมี initStatModel(sequelize) ใน stat_schema.js ด้วย**
// initStatModel(sequelize); 


const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to PostgreSQL');

        // สำคัญ: ซิงค์ตารางทั้งหมด (Sequelize จะสร้างตารางตาม Models หากยังไม่มี)
        // force: false หมายถึงไม่ลบตารางเดิมทิ้ง (ปลอดภัย)
        await sequelize.sync({ force: false }); 
        console.log('✅ All models were synchronized successfully.');

        // 3. Logic สร้าง Admin User
        await createAdminUser(); 

    } catch (error) {
        console.error('❌ PostgreSQL connection or synchronization error:', error.message);
        process.exit(1);
    }
};

connectDB();

// Routes
// Note: ต้องมั่นใจว่า Routes และ Controllers ถูกปรับให้ใช้ Sequelize API แทน Mongoose API แล้ว
app.use('/api/stat', statRoutes);
app.use('/api/auth', authRoutes);

// Health
app.get('/', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server listening on port ${PORT}`);
});