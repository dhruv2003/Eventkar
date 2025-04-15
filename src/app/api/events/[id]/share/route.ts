import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
  }

  try {
    // Example logic: Fetch event details for sharing
    const eventDetails = {
      id,
      name: 'Sample Event',
      description: 'This is a sample event for sharing.',
    };

    return NextResponse.json(eventDetails, { status: 200 });
  } catch (error) {
    console.error('Error sharing event:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve event details' },
      { status: 500 }
    );
  }
}
