import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'polyclinic',
  password: process.env.POSTGRES_PASSWORD || 'pingvin',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
});

export const query = (text: string, params?: any[]) => pool.query(text, params);