import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import routes from './routes/index.js';
import { sequelize } from './database/db.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger.js';
import { seedAdmin } from './seed/seedAdmin.js';
import { seedProducts } from './seed/seedProducts.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

/* ─── Security headers ─── */
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow image loads from frontend
  })
);

/* ─── CORS ─── */
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000').split(',');
app.use(
  cors({
    origin: (origin, cb) => {
      // allow server-to-server or same-origin requests (no origin header)
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

/* ─── Global rate limit (prevents DDoS on every route) ─── */
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Demasiadas peticiones. Intenta más tarde.' },
  })
);

/* ─── Body / compression / logging ─── */
app.use(compression());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

/* ─── Static uploads ─── */
app.use(
  '/uploads',
  express.static(path.join(__dirname, '..', 'uploads'), {
    maxAge: '7d',
    etag: true,
  })
);

/* ─── Health check ─── */
app.get('/', (_req, res) =>
  res.json({ ok: true, service: 'api-repuestos', version: '2.0.0', env: process.env.NODE_ENV || 'development' })
);

/* ─── API docs ─── */
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* ─── Routes ─── */
app.use('/api', routes);

/* ─── 404 handler ─── */
app.use((_req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

/* ─── Global error handler ─── */
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('❌ Unhandled error:', err);
  const status = err.status || 500;
  res.status(status).json({
    message: process.env.NODE_ENV === 'production' ? 'Error interno del servidor' : err.message,
  });
});

/* ─── DB sync + seeds ─── */
const syncDB = async () => {
  try {
    // Use alter only in development; in production prefer migrations
    const alter = process.env.NODE_ENV !== 'production';
    await sequelize.sync({ alter });
    console.log('📦 DB sincronizada');
    await seedAdmin();
    await seedProducts();
  } catch (err) {
    console.error('❌ DB sync error:', err.message);
    process.exit(1);
  }
};

syncDB();

export default app;