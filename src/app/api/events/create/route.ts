import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req: NextRequest) {
  // Check for authentication
  const userCookie = req.cookies.get('user');
  if (!userCookie || !userCookie.value) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Parse user data
  let userData;
  try {
    userData = JSON.parse(userCookie.value);
  } catch {
    return NextResponse.json({ error: 'Invalid user data' }, { status: 401 });
  }

  const body = await req.json();
  const {
    title,
    description,
    image_url,
    date,
    location,
    guest_limit,
    is_public,
    rsvp_approval
  } = body;

  // Use user_id from cookie instead of request body
  const user_id = userData.id;

  if (!user_id || !title || !date || !location) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const result = await pool.query(
      `INSERT INTO events 
        (created_by, title, description, image_url, date, location, guest_limit, is_public, rsvp_approval) 
       VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [user_id, title, description, image_url, date, location, guest_limit, is_public, rsvp_approval]
    );

    return NextResponse.json({ event: result.rows[0] });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
