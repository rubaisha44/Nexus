import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Clock, Users, CheckCircle, XCircle, Calendar as CalendarIcon, Plus, Download } from 'lucide-react';
import { format, isSameDay } from 'date-fns';

type Meeting = {
  id: string;
  title: string;
  date: Date;
  time: string;
  duration: number;
  participants: string[];
  status: 'pending' | 'confirmed' | 'declined' | 'completed';
  type: 'availability' | 'meeting';
};

const MeetingCalendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: '1',
      title: 'Project Review',
      date: new Date(new Date().setDate(new Date().getDate() + 1)),
      time: '10:00',
      duration: 60,
      participants: ['John Investor', 'Sarah Entrepreneur'],
      status: 'confirmed',
      type: 'meeting'
    },
    {
      id: '2',
      title: 'Available Slot',
      date: new Date(new Date().setDate(new Date().getDate() + 2)),
      time: '14:00',
      duration: 30,
      participants: [],
      status: 'pending',
      type: 'availability'
    },
  ]);

  const [newMeeting, setNewMeeting] = useState({
    title: '',
    time: '09:00',
    duration: 30,
    type: 'availability' as 'availability' | 'meeting'
  });

  const hasMeetings = (date: Date) => {
    return meetings.some(meeting => isSameDay(meeting.date, date));
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month' && hasMeetings(date)) {
      return (
        <div className="flex justify-center mt-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        </div>
      );
    }
    return null;
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      if (hasMeetings(date)) {
        return 'has-meeting';
      }
      if (isSameDay(date, new Date())) {
        return 'today';
      }
    }
    return '';
  };

  const addAvailability = () => {
    const newSlot: Meeting = {
      id: Date.now().toString(),
      title: newMeeting.title || 'Available Slot',
      date: new Date(date),
      time: newMeeting.time,
      duration: newMeeting.duration,
      participants: [],
      status: 'pending',
      type: newMeeting.type
    };

    setMeetings([...meetings, newSlot]);
    setNewMeeting({ title: '', time: '09:00', duration: 30, type: 'availability' });
    
    alert('Availability slot added successfully!');
  };

  const updateMeetingStatus = (id: string, status: 'confirmed' | 'declined') => {
    setMeetings(meetings.map(meeting => 
      meeting.id === id ? { ...meeting, status } : meeting
    ));
  };

  const formatTime = (time: string, duration: number) => {
    const timeParts = time.split(':').map(Number);
    const hours = timeParts[0] ?? 0;
    const minutes = timeParts[1] ?? 0;
    const endHour = hours + Math.floor(duration / 60);
    const endMinute = (minutes + duration % 60) % 60;
    return `${time} - ${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: Meeting['status']) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportCalendar = () => {
    const calendarData = meetings.map(m => ({
      Title: m.title,
      Date: format(m.date, 'yyyy-MM-dd'),
      Time: m.time,
      Duration: m.duration,
      Status: m.status,
      Type: m.type
    }));
    
    alert('Calendar exported! In a real app, this would download a file.');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <CalendarIcon className="w-8 h-8" />
              Meeting Scheduler
            </h1>
            <p className="text-gray-600 mt-2">Schedule and manage your meetings</p>
          </div>
          <button
            onClick={exportCalendar}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Select Date
              </h2>
              <Calendar
                onChange={(value) => {
                  if (value instanceof Date) {
                    setDate(value);
                  }
                }}
                value={date}
                className="w-full border-0 react-calendar-custom"
                tileContent={tileContent}
                tileClassName={tileClassName}
              />
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add Availability Slot
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newMeeting.title}
                    onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
                    placeholder="e.g., Available for meetings"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Time
                    </label>
                    <input
                      type="time"
                      value={newMeeting.time}
                      onChange={(e) => setNewMeeting({...newMeeting, time: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (minutes)
                    </label>
                    <select
                      value={newMeeting.duration}
                      onChange={(e) => setNewMeeting({...newMeeting, duration: Number(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={15}>15 min</option>
                      <option value={30}>30 min</option>
                      <option value={45}>45 min</option>
                      <option value={60}>60 min</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slot Type
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="availability"
                        checked={newMeeting.type === 'availability'}
                        onChange={(e) => setNewMeeting({...newMeeting, type: e.target.value as 'availability'})}
                        className="mr-2"
                      />
                      Availability Slot
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="meeting"
                        checked={newMeeting.type === 'meeting'}
                        onChange={(e) => setNewMeeting({...newMeeting, type: e.target.value as 'meeting'})}
                        className="mr-2"
                      />
                      Meeting Request
                    </label>
                  </div>
                </div>

                <button
                  onClick={addAvailability}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Slot
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Scheduled Meetings
              </h2>
              
              {meetings.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No meetings scheduled</p>
              ) : (
                <div className="space-y-4">
                  {meetings.map((meeting) => (
                    <div key={meeting.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{meeting.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                          {meeting.status}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{format(meeting.date, 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(meeting.time, meeting.duration)}</span>
                        </div>
                        
                        {meeting.participants.length > 0 && (
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{meeting.participants.join(', ')}</span>
                          </div>
                        )}
                      </div>

                      {meeting.status === 'pending' && meeting.type === 'meeting' && (
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => updateMeetingStatus(meeting.id, 'confirmed')}
                            className="flex-1 bg-green-600 text-white py-2 rounded flex items-center justify-center gap-1 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Accept
                          </button>
                          <button
                            onClick={() => updateMeetingStatus(meeting.id, 'declined')}
                            className="flex-1 bg-red-600 text-white py-2 rounded flex items-center justify-center gap-1 hover:bg-red-700"
                          >
                            <XCircle className="w-4 h-4" />
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-semibold mb-4">Meeting Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {meetings.filter(m => m.type === 'meeting').length}
                  </div>
                  <div className="text-sm text-gray-600">Total Meetings</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {meetings.filter(m => m.status === 'confirmed').length}
                  </div>
                  <div className="text-sm text-gray-600">Confirmed</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {meetings.filter(m => m.status === 'pending').length}
                  </div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {meetings.filter(m => m.type === 'availability').length}
                  </div>
                  <div className="text-sm text-gray-600">Slots Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .react-calendar-custom {
          width: 100% !important;
          border: none !important;
          font-family: inherit !important;
        }
        
        .react-calendar-custom .react-calendar__tile {
          padding: 1em 0.5em !important;
          border-radius: 8px !important;
        }
        
        .react-calendar-custom .react-calendar__tile--now {
          background: #dbeafe !important;
          color: #1d4ed8 !important;
        }
        
        .react-calendar-custom .react-calendar__tile--active {
          background: #3b82f6 !important;
          color: white !important;
        }
        
        .react-calendar-custom .react-calendar__tile.has-meeting {
          background: #f0f9ff !important;
          border: 2px solid #3b82f6 !important;
        }
        
        .react-calendar-custom .react-calendar__tile.today {
          background: #dbeafe !important;
          border: 2px solid #3b82f6 !important;
        }
      `}</style>
    </div>
  );
};

export default MeetingCalendar;
