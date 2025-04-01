import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');

  if (!token) return NextResponse.json({ error: 'Token required' }, { status: 400 });

  try {
    const result = await pool.query(
      `SELECT * FROM invites WHERE token = $1`,
      [token]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 404 });
    }

    const invite = result.rows[0];
    const createdAt = new Date(invite.created_at);
    const now = new Date();

    const diffMs = now.getTime() - createdAt.getTime();
    const diffMinutes = diffMs / 1000 / 60;

    if (diffMinutes > 5) {
      return NextResponse.json({ error: 'Token expired' }, { status: 410 });
    }

    return NextResponse.json({ message: 'Valid token' });
  } catch (error) {
    console.error('Token Validation Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
