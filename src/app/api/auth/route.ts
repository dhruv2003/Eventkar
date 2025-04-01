import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { type, email, password, name } = body;

  if (!email || !password || (type === 'signup' && !name)) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  try {
    if (type === 'signup') {
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await pool.query(
        'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name',
        [email, hashedPassword, name]
      );

      return NextResponse.json({ user: result.rows[0] });
    }

    if (type === 'login') {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

      if (result.rowCount === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const user = result.rows[0];
      const isValid = await bcrypt.compare(password, user.password_hash);

      if (!isValid) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
    }

    return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
  } catch (error) {
    console.error('Auth Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
