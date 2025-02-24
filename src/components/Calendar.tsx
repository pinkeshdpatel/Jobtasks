import React, { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: { dateTime: string };
  end: { dateTime: string };
}

export const Calendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // Don't render the component if there's no client ID
  if (!clientId) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="text-center text-gray-500">
          Google Calendar integration not configured
        </div>
      </div>
    );
  }

  const login = useGoogleLogin({
    onSuccess: tokenResponse => {
      setAccessToken(tokenResponse.access_token);
    },
    scope: 'https://www.googleapis.com/auth/calendar.readonly',
  });

  useEffect(() => {
    const fetchEvents = async () => {
      if (!accessToken) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          'https://www.googleapis.com/calendar/v3/calendars/primary/events?' +
          new URLSearchParams({
            timeMin: new Date().toISOString(),
            maxResults: '10',
            singleEvents: 'true',
            orderBy: 'startTime',
          }),
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch calendar events');
        }

        const data = await response.json();
        setEvents(data.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (accessToken) {
      fetchEvents();
    }
  }, [accessToken]);

  if (!accessToken) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
            <CalendarIcon className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Connect Google Calendar
          </h3>
          <p className="text-gray-500 mb-4">
            View your upcoming meetings and events
          </p>
          <button
            onClick={() => login()}
            className="btn btn-primary"
          >
            Connect Calendar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-xl font-semibold flex items-center">
          <CalendarIcon className="w-5 h-5 mr-2 text-indigo-600" />
          Upcoming Meetings
        </h2>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">
            Loading events...
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            {error}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No upcoming meetings
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
              >
                <h3 className="font-medium text-gray-900 mb-2">
                  {event.summary}
                </h3>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>
                      {format(parseISO(event.start.dateTime), 'MMM d, h:mm a')} - 
                      {format(parseISO(event.end.dateTime), 'h:mm a')}
                    </span>
                  </div>
                  
                  {event.location && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{event.location}</span>
                    </div>
                  )}
                  
                  {event.description && (
                    <p className="text-gray-500 mt-2 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};