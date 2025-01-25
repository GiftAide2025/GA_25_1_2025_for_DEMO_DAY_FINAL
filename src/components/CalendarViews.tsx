import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Gift } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: string;
  type: string;
}

interface CalendarViewsProps {
  events: Event[];
  view: 'month' | 'week' | 'day';
  onViewChange: (view: 'month' | 'week' | 'day') => void;
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onDayClick?: (date: Date) => void;
}

const CalendarViews: React.FC<CalendarViewsProps> = ({
  events,
  view,
  onViewChange,
  currentDate,
  onDateChange,
  onDayClick
}) => {
  const viewOptions = [
    { value: 'month', label: 'Month' },
    { value: 'week', label: 'Week' },
    { value: 'day', label: 'Day' }
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getWeekDays = (date: Date) => {
    const days = [];
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    
    for (let i = 0; i < 7; i++) {
      days.push(new Date(start));
      start.setDate(start.getDate() + 1);
    }
    return days;
  };

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateString = date.toISOString().split('T')[0];
      const dayEvents = events.filter(event => event.date === dateString);

      days.push(
        <div
          key={day}
          onClick={() => onDayClick?.(date)}
          className="aspect-square p-1 cursor-pointer hover:bg-gray-50"
        >
          <div className={`relative h-full rounded-lg border ${
            dayEvents.length > 0 ? 'border-rose-200 bg-rose-50' : 'border-transparent'
          } p-1 hover:border-rose-300 hover:bg-rose-100 transition-colors`}>
            <span className="text-sm">{day}</span>
            {dayEvents.length > 0 && (
              <div className="absolute bottom-1 right-1">
                <Gift className="w-3 h-3 text-rose-500" />
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
        {days}
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays(currentDate);
    
    return (
      <div className="grid grid-cols-7 gap-4 h-[calc(100vh-300px)]">
        {weekDays.map((day, index) => (
          <div key={index} className="flex flex-col">
            <div className="text-center p-2 bg-gray-50 rounded-t-lg">
              <div className="text-sm font-medium text-gray-600">
                {day.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div 
                className="text-lg font-semibold text-gray-800 cursor-pointer hover:text-rose-500"
                onClick={() => onDayClick?.(day)}
              >
                {day.getDate()}
              </div>
            </div>
            <div className="flex-1 border-l border-gray-200 p-2">
              {events
                .filter(event => event.date === day.toISOString().split('T')[0])
                .map(event => (
                  <div
                    key={event.id}
                    className="mb-2 p-2 bg-rose-50 rounded-lg text-sm"
                  >
                    {event.title}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderDayView = () => {
    const dayEvents = events.filter(
      event => event.date === currentDate.toISOString().split('T')[0]
    );

    return (
      <div className="h-[calc(100vh-300px)] bg-white rounded-lg shadow p-4">
        <div className="text-center mb-4">
          <h3 
            className="text-xl font-semibold cursor-pointer hover:text-rose-500"
            onClick={() => onDayClick?.(currentDate)}
          >
            {currentDate.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })}
          </h3>
        </div>
        <div className="space-y-4">
          {dayEvents.map(event => (
            <div
              key={event.id}
              className="p-4 bg-rose-50 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-rose-500" />
                <h4 className="font-medium">{event.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <CalendarIcon className="w-6 h-6 text-rose-500" />
          <div className="flex gap-2">
            {viewOptions.map(option => (
              <button
                key={option.value}
                onClick={() => onViewChange(option.value as 'month' | 'week' | 'day')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  view === option.value
                    ? 'bg-rose-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              const newDate = new Date(currentDate);
              if (view === 'month') newDate.setMonth(currentDate.getMonth() - 1);
              else if (view === 'week') newDate.setDate(currentDate.getDate() - 7);
              else newDate.setDate(currentDate.getDate() - 1);
              onDateChange(newDate);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg font-medium">
            {currentDate.toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
              ...(view === 'day' && { day: 'numeric' })
            })}
          </span>
          <button
            onClick={() => {
              const newDate = new Date(currentDate);
              if (view === 'month') newDate.setMonth(currentDate.getMonth() + 1);
              else if (view === 'week') newDate.setDate(currentDate.getDate() + 7);
              else newDate.setDate(currentDate.getDate() + 1);
              onDateChange(newDate);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {view === 'month' && renderMonthView()}
      {view === 'week' && renderWeekView()}
      {view === 'day' && renderDayView()}
    </div>
  );
};

export default CalendarViews;