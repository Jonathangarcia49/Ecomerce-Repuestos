
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME || 'repuestosdb',
  process.env.DB_USER || 'admin',
  process.env.DB_PASS || 'admin123',
  {
    host: process.env.DB_HOST || 'postgres',
    port: Number(process.env.DB_PORT || 5432),
    dialect: 'postgres',
    logging: false
  }
);
