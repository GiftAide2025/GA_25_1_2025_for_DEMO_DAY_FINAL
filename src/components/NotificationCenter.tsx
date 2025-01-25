import React, { useState, useEffect } from 'react';
import { Bell, Gift, Calendar, Heart, X, Settings, Star } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface Notification {
  id: string;
  type: 'event' | 'gift' | 'reminder' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Simulate fetching notifications
    const mockNotifications: Notification[] = [
      {
        id: uuidv4(),
        type: 'event',
        title: "Mom's Birthday Coming Up",
        message: "Don't forget to prepare for Mom's birthday next week!",
        timestamp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        read: false,
        action: {
          label: 'Find Gift',
          onClick: () => console.log('Navigate to gift finder')
        }
      },
      {
        id: uuidv4(),
        type: 'gift',
        title: 'New Gift Suggestions',
        message: 'We found some perfect gift ideas based on recent interests',
        timestamp: new Date().toISOString(),
        read: false,
        action: {
          label: 'View Suggestions',
          onClick: () => console.log('Navigate to suggestions')
        }
      },
      {
        id: uuidv4(),
        type: 'reminder',
        title: 'Budget Alert',
        message: 'You have reached 75% of your monthly gift budget',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        read: true
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'event':
        return <Calendar className="w-5 h-5 text-purple-500" />;
      case 'gift':
        return <Gift className="w-5 h-5 text-rose-500" />;
      case 'reminder':
        return <Bell className="w-5 h-5 text-yellow-500" />;
      default:
        return <Heart className="w-5 h-5 text-blue-500" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-rose-500 transition-colors rounded-full hover:bg-gray-100"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-xl shadow-xl z-50 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-rose-500 hover:text-rose-600"
                >
                  Mark all as read
                </button>
                <button
                  onClick={clearAll}
                  className="text-sm text-gray-500 hover:text-gray-600"
                >
                  Clear all
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-100 max-h-[60vh] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-rose-50/50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium text-gray-800">
                            {notification.title}
                          </h4>
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-rose-500 hover:text-rose-600"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                        {notification.action && (
                          <button
                            onClick={notification.action.onClick}
                            className="mt-2 px-3 py-1 bg-rose-100 text-rose-700 rounded-lg text-sm hover:bg-rose-200 transition-colors"
                          >
                            {notification.action.label}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No notifications
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100">
              <button
                className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-800"
              >
                <Settings className="w-4 h-4" />
                Notification Settings
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationCenter;