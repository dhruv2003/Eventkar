'use client';

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/ThemeToggle';

// Toast notification component
interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast = ({ message, type, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto close after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div 
        className={`rounded-lg shadow-lg p-4 flex items-center justify-between ${
          type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}
      >
        <div className="flex items-center">
          {type === 'success' ? (
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span>{message}</span>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

interface EventFormData {
  title: string;
  description: string;
  image_url: string;
  date: string;
  location: string;
  guest_limit: string;
  is_public: boolean;
  rsvp_approval: boolean;
}

interface CreateEventFormProps {
  userName: string;
  refreshUserName: () => void;
}

export default function CreateEventForm({ userName, refreshUserName }: CreateEventFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    image_url: '',
    date: '',
    location: '',
    guest_limit: '',
    is_public: true,
    rsvp_approval: false,
  });
  
  // Toast state
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success',
  });

  // Effect to refresh user data when component mounts
  useEffect(() => {
    refreshUserName();
  }, [refreshUserName]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/events/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, guest_limit: parseInt(formData.guest_limit || '0') }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create event');
      }

      const data = await res.json();
      console.log('Event Created:', data);
      
      // Show success toast
      setToast({
        show: true,
        message: 'Event Created Successfully',
        type: 'success',
      });
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating event:', error);
      
      // Show error toast
      setToast({
        show: true,
        message: error instanceof Error ? error.message : 'Failed to create event. Please try again.',
        type: 'error',
      });
    }
  };

  const closeToast = () => {
    setToast({ ...toast, show: false });
  };

  const handleLogout = () => {
    // Clear the user cookie
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // Also clear localStorage if you're using it as a backup
    localStorage.removeItem('user');
    // Redirect to auth page
    router.push('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Display the user's name
      <h1 className="text-2xl font-bold mb-4">Welcome, {userName}! Create Your Event</h1> */}
      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">EventKar</span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button 
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                onClick={() => router.push('/dashboard')}
              >
                <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div className="relative">
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors duration-200"
                  title="Logout"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 flex items-center justify-center">
                    <span className="text-purple-600 font-medium">{userName.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="text-sm font-medium">{userName}</span>
                  <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      {/* Main Content */}
      <main className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
            <p className="mt-2 text-gray-600">Fill in the details below to create your event.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-8">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Basic Information
                </h2>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="title" className="text-gray-700 font-medium">Event Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter event title"
                      required
                      className="mt-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500 bg-white text-gray-900"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-gray-700 font-medium">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter event description"
                      required
                      className="mt-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500 min-h-[120px] bg-white text-gray-900"
                    />
                  </div>

                  <div>
                    <Label htmlFor="image_url" className="text-gray-700 font-medium">Event Image URL</Label>
                    <Input
                      id="image_url"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleChange}
                      placeholder="Enter image URL"
                      className="mt-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500 bg-white text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Event Details Section */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Event Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="date" className="text-gray-700 font-medium">Date & Time</Label>
                    <Input
                      id="date"
                      name="date"
                      type="datetime-local"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="mt-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500 bg-white text-gray-900"
                    />
                  </div>

                  <div>
                    <Label htmlFor="location" className="text-gray-700 font-medium">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Enter event location"
                      required
                      className="mt-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500 bg-white text-gray-900"
                    />
                  </div>

                  <div>
                    <Label htmlFor="guest_limit" className="text-gray-700 font-medium">Guest Limit</Label>
                    <Input
                      id="guest_limit"
                      name="guest_limit"
                      type="number"
                      value={formData.guest_limit}
                      onChange={handleChange}
                      placeholder="Enter maximum number of guests"
                      min="0"
                      className="mt-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500 bg-white text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Event Settings Section */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Event Settings
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="is_public"
                      name="is_public"
                      checked={formData.is_public}
                      onChange={handleChange}
                      className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <Label htmlFor="is_public" className="text-gray-700">Public Event</Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="rsvp_approval"
                      name="rsvp_approval"
                      checked={formData.rsvp_approval}
                      onChange={handleChange}
                      className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <Label htmlFor="rsvp_approval" className="text-gray-700">Require RSVP Approval</Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-8 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard')}
                className="px-6 py-2.5 border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
              >
                Create Event
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}