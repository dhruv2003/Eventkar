'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function CreateEventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // Client-side authentication check
  useEffect(() => {
    const user = Cookies.get('user') || localStorage.getItem('user');
    
    if (!user) {
      router.push('/auth');
    }
  }, [router]);

  return (
    <div>
      {/* Create event layout can go here */}
      {children}
    </div>
  );
} 