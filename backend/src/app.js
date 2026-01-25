
import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { sequelize } from './database/db.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger.js';
import { seedAdmin } from './seed/seedAdmin.js';
import { seedProducts } from './seed/seedProducts.js';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get('/', (_req, res) => res.json({ ok: true, service: 'api-repuestos' }));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', routes);

sequelize
  .sync({ alter: true })
  .then(async () => {
    console.log('📦 DB sincronizada');
    await seedAdmin();
    await seedProducts();
  })
  .catch((err) => console.error('❌ DB sync error:', err));

export default app;
