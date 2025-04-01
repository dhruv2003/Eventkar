'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function RSVPPage() {
  const { token } = useParams();
  const [status, setStatus] = useState<'loading' | 'expired' | 'valid' | 'submitted'>('loading');
  const [name, setName] = useState('');

  useEffect(() => {
    const checkToken = async () => {
      const res = await fetch(`/api/invites/validate?token=${token}`);
      const data = await res.json();

      if (res.status === 200) setStatus('valid');
      else setStatus('expired');
    };

    checkToken();
  }, [token]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await fetch(`/api/rsvps/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, name }),
    });
    setStatus('submitted');
  };

  if (status === 'loading') return <p className="p-4">Checking invite...</p>;
  if (status === 'expired') return <p className="p-4 text-red-500">Invite link expired or invalid.</p>;
  if (status === 'submitted') return <p className="p-4 text-green-600">RSVP submitted! 🎉</p>;

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">RSVP to Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Your Name</label>
          <input
            className="w-full p-2 border rounded"
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Submit RSVP
        </button>
      </form>
    </div>
  );
}
