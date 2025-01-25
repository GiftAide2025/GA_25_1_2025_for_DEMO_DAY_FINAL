import React, { useState } from 'react';
import { Calendar, Link2, X, Check, AlertCircle, Clock } from 'lucide-react';

const GoogleCalendarCard: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = () => {
    setIsConnecting(true);
    setError('Google Calendar integration will be available soon!');
    setTimeout(() => {
      setIsConnecting(false);
    }, 1500);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
  };

  return (
    <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform">
          <Calendar className="w-8 h-8 text-purple-500" />
        </div>
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${
          isConnected 
            ? 'text-green-500 bg-green-50' 
            : 'text-purple-500 bg-purple-50'
        }`}>
          {isConnected ? 'Connected' : 'Not Connected'}
        </span>
      </div>

      <h3 className="text-2xl font-bold mb-2">Calendar Integration</h3>
      <p className="text-gray-600 mb-6">
        {isConnected 
          ? 'Your calendar is synced for gift reminders' 
          : 'Connect your calendar to never miss important gift dates'}
      </p>

      {error && (
        <div className="mb-4 p-3 bg-purple-50 rounded-lg flex items-start gap-2">
          <Clock className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-purple-600">{error}</p>
        </div>
      )}

      {isConnected ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-green-500">
            <Check className="w-5 h-5" />
            <span className="text-sm">Calendar synced successfully</span>
          </div>
          <button
            onClick={handleDisconnect}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-5 h-5" />
            Disconnect Calendar
          </button>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-rose-500 text-white rounded-lg hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] hover:shadow-lg"
        >
          {isConnecting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Connecting...
            </>
          ) : (
            <>
              <Link2 className="w-5 h-5" />
              Connect Calendar
            </>
          )}
        </button>
      )}

      {!isConnected && !error && (
        <div className="mt-4 flex items-center justify-center">
          <span className="text-xs text-gray-500">
            Powered by Google Calendar
          </span>
        </div>
      )}
    </div>
  );
};

export default GoogleCalendarCard;