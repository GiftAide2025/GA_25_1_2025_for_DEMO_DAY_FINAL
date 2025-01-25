import React, { useState } from 'react';
import { Calendar, Link2, X, Check, Mail, Bell, ChevronRight } from 'lucide-react';

const CalendarIntegration: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    // Simulate connection success
    setIsConnected(true);
    setIsEmailModalOpen(false);
    setError(null);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setEmail('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-rose-500" />
            <h2 className="text-xl font-semibold">Calendar Integration</h2>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            isConnected 
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-600'
          }`}>
            {isConnected ? 'Connected' : 'Not Connected'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status Card */}
          <div className={`p-6 rounded-xl border-2 transition-all ${
            isConnected
              ? 'border-green-200 bg-green-50'
              : 'border-gray-200 hover:border-rose-200'
          }`}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  {isConnected ? 'Calendar Connected' : 'Connect Your Calendar'}
                </h3>
                <p className="text-sm text-gray-600">
                  {isConnected
                    ? 'Your calendar is synced for gift reminders'
                    : 'Never miss important gift dates'}
                </p>
              </div>
              {isConnected ? (
                <Check className="w-6 h-6 text-green-500" />
              ) : (
                <Link2 className="w-6 h-6 text-gray-400" />
              )}
            </div>

            <div className="mt-4">
              {isConnected ? (
                <button
                  onClick={handleDisconnect}
                  className="text-sm text-gray-600 hover:text-rose-500 transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Disconnect Calendar
                </button>
              ) : (
                <button
                  onClick={() => setIsEmailModalOpen(true)}
                  className="text-sm text-rose-500 hover:text-rose-600 transition-colors flex items-center gap-2"
                >
                  Connect Now
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Reminders Card */}
          <div className="p-6 rounded-xl border-2 border-gray-200 hover:border-rose-200 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Gift Reminders
                </h3>
                <p className="text-sm text-gray-600">
                  Customize when you receive reminders
                </p>
              </div>
              <Bell className="w-6 h-6 text-gray-400" />
            </div>

            <div className="mt-4 space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-rose-500 focus:ring-rose-500"
                  defaultChecked
                />
                <span className="text-sm text-gray-600">30 days before</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-rose-500 focus:ring-rose-500"
                  defaultChecked
                />
                <span className="text-sm text-gray-600">7 days before</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-rose-500 focus:ring-rose-500"
                  defaultChecked
                />
                <span className="text-sm text-gray-600">Day of event</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Email Modal */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setIsEmailModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="mb-6">
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-rose-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Connect Calendar</h3>
              <p className="text-gray-600 text-sm">Enter your email to connect Google Calendar</p>
            </div>

            <form onSubmit={handleConnect} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
                {error && (
                  <p className="text-sm text-red-500 mt-1">{error}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors flex items-center justify-center gap-2"
              >
                <Link2 className="w-5 h-5" />
                Connect Calendar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarIntegration;