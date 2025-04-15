'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import CreateEventForm from '@/components/events/CreateEventForm';

export default function CreateEventPage() {
  const [userName, setUserName] = useState('Guest');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Function to get fresh user data
  const fetchUserData = useCallback(() => {
    const userDataStr = document.cookie
      .split('; ')
      .find(row => row.startsWith('user='))
      ?.split('=')[1];
    
    if (!userDataStr) {
      console.error('No user data found in cookies');
      router.push('/auth'); // Redirect to auth page if no user data
      return;
    }

    try {
      const userData = JSON.parse(decodeURIComponent(userDataStr));
      setUserName(userData.name || 'Guest');
      setLoading(false);
    } catch (error) {
      console.error('Error parsing user data:', error);
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchUserData();
    
    // Set up a polling mechanism to check for user data updates
    const interval = setInterval(fetchUserData, 10000); // Check every 10 seconds
    
    return () => clearInterval(interval); // Clean up on unmount
  }, [fetchUserData]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return <CreateEventForm userName={userName} refreshUserName={fetchUserData} />;
}
