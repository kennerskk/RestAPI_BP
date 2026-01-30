import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import { Sequelize } from 'sequelize';
import cors from 'cors';
import dotenv from 'dotenv';

// Routes
import statRoutes from './routes/statRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Models
import User, { initUserModel, createAdminUser } from './models/user_schema.js';
import { initStatModel, Stat } from './models/stat_schema.js';

dotenv.config();

/* ================== APP ================== */
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not set');
  process.exit(1);
}

/* ================== DATABASE ================== */
const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});

initUserModel(sequelize);
initStatModel(sequelize);

try {
  await sequelize.authenticate();
  console.log('✅ Connected to PostgreSQL');

  await sequelize.sync({ force: false });
  console.log('✅ Models synchronized');

  await createAdminUser();
} catch (err) {
  console.error('❌ Database error:', err.message);
  process.exit(1);
}

/* ================== ROUTES ================== */
app.use('/api/stat', statRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

/* ================== HTTP + WEBSOCKET ================== */
const server = http.createServer(app);

/**
 * WebSocket จะรับที่:
 *   wss://mctrl.kmutt.ac.th/ken-api/
 */
const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (req, socket, head) => {
  try {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);

    if (pathname === '/') {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', ws, req);
      });
    } else {
      socket.destroy();
    }
  } catch (err) {
    socket.destroy();
  }
});

/* ================== WS LOGIC ================== */
wss.on('connection', (ws, req) => {
  console.log('🔌 WS connected from', req.socket.remoteAddress);

  ws.on('message', async (raw) => {
    try {
      const payload = JSON.parse(raw.toString());

      await Stat.create({
        data: payload,
      });

      ws.send(JSON.stringify({ status: 'ok' }));
    } catch (err) {
      ws.send(
        JSON.stringify({
          status: 'error',
          message: err.message,
        })
      );
    }
  });

  ws.on('close', () => {
    console.log('❌ WS disconnected');
  });
});

/* ================== START ================== */
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 HTTP + WS running on port ${PORT}`);
});
