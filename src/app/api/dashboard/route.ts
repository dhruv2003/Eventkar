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
    const userQuery = await pool.query('SELECT name FROM users WHERE id = $1', [userId]);
    const totalEventsQuery = await pool.query('SELECT COUNT(*) FROM events WHERE created_by = $1', [userId]);
    const upcomingEventsQuery = await pool.query('SELECT COUNT(*) FROM events WHERE created_by = $1 AND date > NOW()', [userId]);
    const todaysEventsQuery = await pool.query('SELECT COUNT(*) FROM events WHERE created_by = $1 AND DATE(date) = CURRENT_DATE', [userId]);
    const totalAttendeesQuery = await pool.query(
      `SELECT COUNT(*) 
       FROM rsvps 
       WHERE event_id IN (SELECT id FROM events WHERE created_by = $1)`,
      [userId]
    );

    const name = userQuery.rows[0]?.name || 'User';
    const totalEvents = parseInt(totalEventsQuery.rows[0]?.count || '0', 10);
    const upcomingEvents = parseInt(upcomingEventsQuery.rows[0]?.count || '0', 10);
    const todaysEvents = parseInt(todaysEventsQuery.rows[0]?.count || '0', 10);
    const totalAttendees = parseInt(totalAttendeesQuery.rows[0]?.count || '0', 10);

    return NextResponse.json({ name, totalEvents, upcomingEvents, todaysEvents, totalAttendees });
  } catch (error) {
    const errorMessage = (error as Error).message; // Cast 'error' to 'Error' type
    console.error('Error fetching dashboard data:', errorMessage); // Log the error message
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
