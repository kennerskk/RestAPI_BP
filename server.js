import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import statRoutes from './routes/statRoutes.js';
import authRoutes from './routes/authRoutes.js';
import User from './models/user_schema.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI not set. Copy .env.example to .env and set MONGO_URI');
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  // useNewUrlParser and useUnifiedTopology are default in modern mongoose
})  
.then(() => {
  console.log('✅ Connected to MongoDB');
  // Create admin user if not exists
  const createAdmin = async () => {
    try {
      const adminUsername = process.env.ADMIN_USERNAME;
      const adminPassword = process.env.ADMIN_PASSWORD;

      if (!adminUsername || !adminPassword) {
        console.log('🟠 ADMIN_USERNAME or ADMIN_PASSWORD not set. Skipping admin creation.');
        return;
      }

      const existingAdmin = await User.findOne({ username: adminUsername });
      if (!existingAdmin) {
        const adminUser = new User({
          username: adminUsername,
          password: adminPassword, // Password will be hashed by the 'pre-save' hook in the model
        });
        await adminUser.save();
        console.log('✅ Admin user created');
      } else {
        console.log('ℹ️ Admin user already exists');
      }
    } catch (error) {
      console.error('❌ Error creating admin user:', error);
    }
  };
  createAdmin();
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Routes
app.use('/api/stat', statRoutes);
app.use('/api/auth', authRoutes);

// Health
app.get('/', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT,'0.0.0.0', () => {
  console.log(`🚀 Server listening on port${PORT}`);
});
