import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';

const router = express.Router();

// Create a new PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});


router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const table = role === 'student' ? 'students' : 'instructors';

    // Check if user already exists
    const userExists = await pool.query(`SELECT 1 FROM ${table} WHERE email = $1`, [email]);

    if (userExists?.rowCount && userExists.rowCount > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    await pool.query(
      `INSERT INTO ${table} (name, email, password_hash) VALUES ($1, $2, $3)`,
      [name, email, hashedPassword]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
