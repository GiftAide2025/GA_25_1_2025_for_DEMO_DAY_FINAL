import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft } from 'lucide-react';
import CalendarViews from '../components/CalendarViews';
import AddEventModal from '../components/AddEventModal';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

interface Event {
  id: string;
  title: string;
  date: string;
  type: string;
}

const CalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('No authenticated user');
        }

        const { data: recipients, error: recipientsError } = await supabase
          .from('recipients')
          .select('*')
          .eq('user_id', user.id);

        if (recipientsError) throw recipientsError;

        // Transform recipient data into events
        const transformedEvents = recipients?.map(recipient => ({
          id: recipient.id,
          title: `${recipient.name}'s Birthday`,
          date: recipient.birthdate,
          type: 'birthday'
        })) || [];

        setEvents(transformedEvents);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setIsAddEventModalOpen(true);
  };

  const handleAddEvent = async (eventData: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      // If we have a selected date, use it for the birthdate
      const finalEventData = {
        ...eventData,
        birthdate: selectedDate ? selectedDate.toISOString().split('T')[0] : eventData.birthdate
      };

      const { data, error } = await supabase
        .from('recipients')
        .insert([{
          user_id: user.id,
          ...finalEventData
        }])
        .select()
        .single();

      if (error) throw error;

      // Add new event to state
      setEvents(prev => [...prev, {
        id: data.id,
        title: `${data.name}'s Birthday`,
        date: data.birthdate,
        type: 'birthday'
      }]);

      setIsAddEventModalOpen(false);
      setSelectedDate(null);
    } catch (err) {
      console.error('Error adding event:', err);
      setError('Failed to add event. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-100 to-purple-100">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate('/dashboard')}
          className="group mb-8 inline-flex items-center text-gray-600 hover:text-rose-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <CalendarViews
              events={events}
              view={view}
              onViewChange={setView}
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              onDayClick={handleDayClick}
            />
          )}
        </div>
      </div>

      <AddEventModal
        isOpen={isAddEventModalOpen}
        onClose={() => {
          setIsAddEventModalOpen(false);
          setSelectedDate(null);
        }}
        onSubmit={handleAddEvent}
      />
    </div>
  );
};

export default CalendarPage;