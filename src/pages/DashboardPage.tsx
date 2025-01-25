import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useRegion } from '../context/RegionContext';
import { getTimeBasedGreeting, getRandomWelcomeMessage } from '../utils/greetings';
import { formatCurrency } from '../utils/currency';
import { createClient } from '@supabase/supabase-js';
import {
  Gift, Heart, Calendar, Clock, ShoppingBag, 
  Sparkles, Zap, ArrowRight, Star, 
  PartyPopper, Package, Rocket,
  User, Users, Bell, Search, Plus,
  Database, Trophy, Activity, DollarSign,
  Award, Baby, GraduationCap, Music, Lamp,
  Brain, Home, Globe, MessageSquare, Share2, X, Link,
  UserPlus, Settings, Mic
} from 'lucide-react';
import FindPerfectGiftModal from '../components/FindPerfectGiftModal';
import NotificationCenter from '../components/NotificationCenter';
import RegionSelector from '../components/RegionSelector';
import AddRecipientForm from '../components/AddRecipientForm';
import GiftyVoiceAgentModal from '../components/GiftyVoiceAgentModal';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

interface UpcomingEvent {
  id: string;
  name: string;
  type: string;
  daysUntil: number;
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { region } = useRegion();
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [isAddRecipientModalOpen, setIsAddRecipientModalOpen] = useState(false);
  const [isVoiceAgentModalOpen, setIsVoiceAgentModalOpen] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      setEventsLoading(true);
      setEventsError(null);

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setEventsError('User not authenticated');
          return;
        }

        const { data: recipients, error } = await supabase
          .from('recipients')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          throw error;
        }

        if (!recipients || recipients.length === 0) {
          setUpcomingEvents([]);
          return;
        }

        const today = new Date();
        const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
        
        const events = recipients.map(recipient => {
          const birthdate = new Date(recipient.birthdate);
          const nextBirthday = new Date(
            today.getFullYear(),
            birthdate.getMonth(),
            birthdate.getDate()
          );
          
          if (nextBirthday < today) {
            nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
          }

          return {
            id: recipient.id,
            name: recipient.name,
            type: 'Birthday',
            daysUntil: Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
          };
        }).filter(event => event.daysUntil <= 30)
          .sort((a, b) => a.daysUntil - b.daysUntil);

        setUpcomingEvents(events);
      } catch (error) {
        console.error('Error fetching upcoming events:', error);
        setEventsError('Failed to load upcoming events');
      } finally {
        setEventsLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  const handleFindGift = () => {
    setIsGiftModalOpen(true);
  };

  const handleAddRecipient = (data: any) => {
    console.log('New recipient data:', data);
    setIsAddRecipientModalOpen(false);
  };

  const renderUpcomingEvents = () => {
    if (eventsLoading) {
      return (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-rose-500"></div>
        </div>
      );
    }

    if (eventsError) {
      return (
        <div className="text-center py-4">
          <p className="text-gray-600 text-sm">{eventsError}</p>
        </div>
      );
    }

    if (upcomingEvents.length === 0) {
      return (
        <div className="text-center py-4">
          <p className="text-black-600 text-sm">No upcoming events</p>
          <button
            onClick={() => setIsAddRecipientModalOpen(true)}
            className="mt-2 text-sm text-rose-500 hover:text-rose-600"
          >
            Add a recipient
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {upcomingEvents.map((event) => (
          <div
            key={event.id}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-black-600">{event.name}'s {event.type}</span>
            <span className="text-rose-500">In {event.daysUntil} days</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-300 to-purple-300">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-md border-b border-gray-100/50 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="relative group">
                <div className="absolute inset-0 bg-rose-200 rounded-lg blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <Gift className="w-6 h-6 text-rose-500 relative transform group-hover:scale-110 transition-transform" />
              </div>
              <span 
                onClick={() => navigate('/')} 
                className="text-xl font-bold cursor-pointer hover:opacity-80 transition-opacity"
              >
                gift<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600">AI</span>de
              </span>
            </div>
            
            <div className="flex items-center space-x-6">
              <RegionSelector />
              <NotificationCenter />
              <button className="text-gray-600 hover:text-rose-500 transition-all duration-300 transform hover:rotate-12">
                <Settings className="w-5 h-5" />
              </button>
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-rose-200 hover:ring-rose-400 transition-all duration-300"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-purple-500 rounded-full flex items-center justify-center transform hover:rotate-12 transition-all duration-300">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Enhanced Hero Section with increased size */}
        <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl mb-16 group">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-25"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-rose-100/50 via-purple-100/50 to-rose-100/50 mix-blend-soft-light"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent"></div>
          </div>

          <div className="relative px-8 py-36 flex flex-col items-center text-center">
            <h1 className="text-5xl font-bold mb-6">
              {getTimeBasedGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600 animate-gradient">{user?.name?.split(' ')[0] || 'Friend'}</span>!
            </h1>
            <p className="text-gray-600 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              {getRandomWelcomeMessage()}
            </p>
            
            {/* Enhanced Gift Animation */}
            <div className="relative w-40 h-40 mb-12">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-purple-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 animate-pulse"></div>
              <div className="animate-float">
                <Gift className="w-40 h-40 text-rose-500 transform group-hover:rotate-12 transition-transform duration-500" />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsGiftModalOpen(true)}
                className="group relative px-8 py-4 text-xl font-bold text-white rounded-full overflow-hidden transform hover:scale-105 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-purple-600 animate-gradient"></div>
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <span className="relative flex items-center">
                  Find Perfect Gift
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>

              <button
                onClick={() => setIsVoiceAgentModalOpen(true)}
                className="group relative px-8 py-4 text-xl font-bold text-white rounded-full overflow-hidden transform hover:scale-105 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-rose-600 animate-gradient"></div>
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <span className="relative flex items-center">
                  Gifty-Voice Agent
                  <Mic className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Grid Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Upcoming Events */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-rose-500" />
              </div>
              <span className="text-sm font-medium text-black bg-rose-50 px-3 py-1 rounded-full">
                This Month
              </span>
            </div>
            <h3 className="text-xl font-bold mb-4">Upcoming Events</h3>
            <div className="space-y-3">
              {renderUpcomingEvents()}
            </div>
          </div>

          {/* Add New Recipient */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-purple-500" />
              </div>
              <span className="text-sm font-medium text-black bg-purple-50 px-3 py-1 rounded-full">
                Quick Add
              </span>
            </div>
            <h3 className="text-xl font-bold mb-4">Add New Recipient</h3>
            <p className="text-gray-600 flex-1">Keep track of important dates and preferences</p>
            <button
              onClick={() => setIsAddRecipientModalOpen(true)}
              className="w-full px-4 py-2 bg-gradient-to-b from-rose-300 to-purple-300 text-black rounded-lg hover:bg-gradient-to-b from-rose-300 to-purple-300 transition-colors flex items-center justify-center gap-2 mt-4"
            >
              <Plus className="w-5 h-5" />
              Add Recipient
            </button>
          </div>

          {/* Group Gifting */}
          <div
            onClick={() => navigate('/group-gifting')}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-sm font-medium text-black bg-blue-50 px-3 py-1 rounded-full">
                Collaborate
              </span>
            </div>
            <h3 className="text-xl font-bold mb-4">Group Gifting</h3>
            <p className="text-gray-600 flex-1">Team up for meaningful gifts</p>
            <div className="flex items-center text-black mt-4">
              <span>Start collaborating</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </div>
          </div>

          {/* Gift Budget Tracker */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-500" />
              </div>
              <span className="text-sm font-medium text-yellow-500 bg-yellow-50 px-3 py-1 rounded-full">
                Budget
              </span>
            </div>
            <h3 className="text-xl font-bold mb-4">Gift Budget</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Spent this month</span>
                <span className="font-medium">{formatCurrency(250, region)}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-yellow-500 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Calendar Integration */}
          <div 
            onClick={() => navigate('/calendar')}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-indigo-500" />
              </div>
              <span className="text-sm font-medium text-black bg-indigo-50 px-3 py-1 rounded-full">
                Connected
              </span>
            </div>
            <h3 className="text-xl font-bold mb-4">Calendar</h3>
            <p className="text-gray-600 flex-1">Never miss important dates</p>
            <div className="flex items-center text-black mt-4">
              <span>View Calendar</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </div>
          </div>

          {/* Recipients List */}
          <div
            onClick={() => navigate('/recipients')}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                <Database className="w-6 h-6 text-teal-500" />
              </div>
              <span className="text-sm font-medium text-black bg-teal-50 px-3 py-1 rounded-full">
                Database
              </span>
            </div>
            <h3 className="text-xl font-bold mb-4">Recipients List</h3>
            <p className="text-gray-600 flex-1">Manage all your recipients</p>
            <div className="flex items-center text-black mt-4">
              <span>View Recipients</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <FindPerfectGiftModal isOpen={isGiftModalOpen} onClose={() => setIsGiftModalOpen(false)} />
      <GiftyVoiceAgentModal isOpen={isVoiceAgentModalOpen} onClose={() => setIsVoiceAgentModalOpen(false)} />
      <AddRecipientForm
        isOpen={isAddRecipientModalOpen}
        onClose={() => setIsAddRecipientModalOpen(false)}
        onSubmit={handleAddRecipient}
      />
    </div>
  );
};

export default DashboardPage;