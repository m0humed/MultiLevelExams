import express from 'express';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Create a new PostgreSQL connection pool
console.log(process.env.DATABASE_URL);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

router.post('/register', async (req, res) => {
  try {
    
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const table = role === 'student' ? 'students' : 'instructors';

    // Check if user already exists
    const userExists = await pool.query(`SELECT 1 FROM ${table} WHERE email = $1`, [email]);
    if (userExists && userExists.rowCount > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert new user
    await pool.query(
      `INSERT INTO ${table} (name, email, password_hash) VALUES ($1, $2, $3)`,
      [name, email, hashedPassword]
    );

    console.log(`New ${role} registered:`, { name, email });
    // Always send a JSON response
    res.json({ success: true });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error in Registration Process' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const table = role === 'student' ? 'students' : 'instructors';
    const userRes = await pool.query(
      `SELECT * FROM ${table} WHERE email = $1`,
      [email]
    );
    if (userRes.rowCount === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const user = userRes.rows[0];

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // You can add JWT or session logic here if needed
    res.json({
      success: true,
      user: {
        id: user.student_id || user.instructor_id,
        name: user.name,
        email: user.email,
        role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

