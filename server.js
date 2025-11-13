import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import statRoutes from './routes/statRoutes.js';

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
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Routes
app.use('/api/stat', statRoutes);

// Health
app.get('/', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT,'0.0.0.0', () => {
  console.log(`🚀 Server listening on port${PORT}`);
});
