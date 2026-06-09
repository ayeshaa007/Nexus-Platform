import React, { useState } from 'react';
import { Calendar, Clock, Users, CheckCircle } from 'lucide-react';
import { MeetingCalendar } from '../../components/calendar/MeetingCalendar';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import {
  meetingRequests,
  availabilitySlots,
  addMeetingRequest,
  updateMeetingStatus,
  addAvailabilitySlot,
} from '../../data/calendarData';

const statusVariant = { confirmed: 'success', pending: 'warning', declined: 'error' };

export const CalendarPage = () => {
  const [meetings, setMeetings] = useState([...meetingRequests]);
  const [slots, setSlots] = useState([...availabilitySlots]);

  const confirmed = meetings.filter((m) => m.status === 'confirmed');
  const pending = meetings.filter((m) => m.status === 'pending');

  const handleAccept = (id) => {
    updateMeetingStatus(id, 'confirmed');
    setMeetings((prev) => prev.map((m) => (m.id === id ? { ...m, status: 'confirmed' } : m)));
  };

  const handleDecline = (id) => {
    updateMeetingStatus(id, 'declined');
    setMeetings((prev) => prev.map((m) => (m.id === id ? { ...m, status: 'declined' } : m)));
  };

  const handleAddSlot = (slot) => {
    const newSlot = addAvailabilitySlot(slot);
    setSlots((prev) => [...prev, newSlot]);
  };

  const handleSchedule = (form) => {
    const newMeeting = addMeetingRequest({
      title: form.title,
      requesterId: 'current',
      requesterName: 'You',
      requesterAvatar: '',
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      notes: form.notes,
      type: 'investor-entrepreneur',
    });
    setMeetings((prev) => [...prev, newMeeting]);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Meeting Calendar</h1>
        <p className="text-gray-600">
          Manage your availability and schedule meetings with investors and entrepreneurs
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: 'Upcoming Meetings',
            value: confirmed.length,
            icon: <Calendar size={20} className="text-primary-600" />,
            bg: 'bg-primary-50',
          },
          {
            label: 'Pending Requests',
            value: pending.length,
            icon: <Clock size={20} className="text-warning-600" />,
            bg: 'bg-yellow-50',
          },
          {
            label: 'Open Slots',
            value: slots.filter((s) => !s.isBooked).length,
            icon: <CheckCircle size={20} className="text-success-600" />,
            bg: 'bg-green-50',
          },
        ].map((s) => (
          <Card key={s.label}>
            <CardBody>
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${s.bg}`}>{s.icon}</div>
                <div>
                  <p className="text-sm text-gray-500">{s.label}</p>
                  <p className="text-xl font-bold text-gray-900">{s.value}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Calendar */}
      <MeetingCalendar
        meetings={meetings}
        availabilitySlots={slots}
        onAccept={handleAccept}
        onDecline={handleDecline}
        onAddSlot={handleAddSlot}
        onSchedule={handleSchedule}
      />

      {/* All meetings list */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users size={18} className="text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">All Meetings</h2>
          </div>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  {['Meeting', 'With', 'Date & Time', 'Status', ''].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {meetings.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{m.title}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar src={m.requesterAvatar} alt={m.requesterName} size="xs" />
                        <span className="text-gray-700">{m.requesterName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {m.date} &nbsp;·&nbsp; {m.startTime}–{m.endTime}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant[m.status]} size="sm">
                        {m.status.charAt(0).toUpperCase() + m.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {m.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAccept(m.id)}
                            className="text-xs font-medium text-success-600 hover:underline"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleDecline(m.id)}
                            className="text-xs font-medium text-error-600 hover:underline"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
