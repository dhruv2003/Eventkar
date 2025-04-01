import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { event_id, guest_email } = body;

  if (!event_id || !guest_email) {
    return NextResponse.json({ error: 'Missing event_id or guest_email' }, { status: 400 });
  }

  try {
    const token = uuidv4();

    // Insert token into invites table
    await pool.query(
      `INSERT INTO invites (event_id, guest_email, token) VALUES ($1, $2, $3)`,
      [event_id, guest_email, token]
    );

    const link = `http://localhost:3000/rsvp/${token}`;

    return NextResponse.json({ link });
  } catch (error) {
    console.error('Invite Link Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
