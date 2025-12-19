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

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// ✅ serve frontend
app.use('/ken-api', express.static(path.join(__dirname, 'frontend')));

const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});

initUserModel(sequelize);
initStatModel(sequelize);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    await createAdminUser();
    console.log('✅ Database ready');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

connectDB();

// ✅ API routes (แก้ตรงนี้!)
app.use('/ken-api/api/stat', statRoutes);
app.use('/ken-api/api/auth', authRoutes);

app.get('/ken-api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
