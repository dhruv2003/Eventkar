import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function POST(req: NextRequest) {
  const { token, name } = await req.json();

  if (!token || !name) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  try {
    const inviteRes = await pool.query(`SELECT * FROM invites WHERE token = $1`, [token]);
    if (inviteRes.rowCount === 0) return NextResponse.json({ error: 'Invalid token' }, { status: 400 });

    const invite = inviteRes.rows[0];
    const eventId = invite.event_id;

    // Create user
    const userRes = await pool.query(
      `INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING id`,
      [invite.guest_email, name, 'placeholder'] // password not needed for guest
    );
    const userId = userRes.rows[0].id;

    // Insert RSVP
    await pool.query(
      `INSERT INTO rsvps (event_id, user_id, approved) VALUES ($1, $2, $3)`,
      [eventId, userId, true]
    );

    return NextResponse.json({ message: 'RSVP submitted' });
  } catch (err) {
    console.error('RSVP Error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
