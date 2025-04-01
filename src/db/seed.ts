import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function seed() {
  try {
    // Hash the password
    const password = 'test123';
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert test user
    await pool.query(
      'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING',
      ['test@example.com', passwordHash, 'Test User']
    );

    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await pool.end();
  }
}

seed(); 