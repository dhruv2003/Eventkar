import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(req: NextRequest) {
  const userCookie = req.cookies.get('user');
  if (!userCookie || !userCookie.value) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let userData;
  try {
    userData = JSON.parse(userCookie.value);
  } catch {
    return NextResponse.json({ error: 'Invalid user data' }, { status: 401 });
  }

  const userId = userData.id;

  try {
    const eventsQuery = await pool.query(
      `SELECT id, title, date, 
              (SELECT COUNT(*) FROM rsvps WHERE event_id = events.id) AS attendees,
              CASE 
                WHEN date > NOW() THEN 'Upcoming'
                WHEN date <= NOW() AND date >= CURRENT_DATE THEN 'Active'
                ELSE 'Completed'
              END AS status
       FROM events
       WHERE created_by = $1
       ORDER BY date DESC
       LIMIT 5`,
      [userId]
    );

    return NextResponse.json({ events: eventsQuery.rows });
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error('Error fetching recent events:', errorMessage);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
