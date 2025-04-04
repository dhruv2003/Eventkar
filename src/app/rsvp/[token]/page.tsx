'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function RSVPPage() {
  const { token } = useParams();
  const [status, setStatus] = useState<'loading' | 'expired' | 'valid'>('loading');

  useEffect(() => {
    const checkToken = async () => {
      const res = await fetch(`/api/invites/validate?token=${token}`);

      if (res.status === 200) setStatus('valid');
      else setStatus('expired');
    };

    checkToken();
  }, [token]);

  if (status === 'loading') return <p className="p-4">Checking invite...</p>;
  if (status === 'expired') return <p className="p-4 text-red-500">Invite link expired or invalid.</p>;

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">RSVP to Event</h2>
      <p className="p-4 text-green-600">RSVP functionality has been removed.</p>
    </div>
  );
}
