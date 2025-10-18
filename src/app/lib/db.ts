import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root1',
  database: process.env.DB_NAME || 'deadlock_stats',
  port: Number(process.env.DB_PORT) || 3306
});