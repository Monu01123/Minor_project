import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});


const promisePool = pool.promise();

const testConnection = async () => {
  try {
    await promisePool.query('SELECT 1');
    console.log('Database connection successful.');
  } catch (err) {
    console.error('Database connection failed:', err.message);
  }
};

export { promisePool, testConnection };
