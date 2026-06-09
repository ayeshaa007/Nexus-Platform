import React, { useState } from 'react';
import {
  ChevronLeft, ChevronRight, Plus, Clock, Check, X, Calendar,
} from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card, CardBody, CardHeader } from '../ui/Card';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

const statusVariant = { confirmed: 'success', pending: 'warning', declined: 'error' };
const statusLabel = { confirmed: 'Confirmed', pending: 'Pending', declined: 'Declined' };

export const MeetingCalendar = ({
  meetings = [],
  availabilitySlots = [],
  onAccept,
  onDecline,
  onAddSlot,
  onSchedule,
}) => {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [newSlot, setNewSlot] = useState({ startTime: '09:00', endTime: '10:00' });
  const [scheduleForm, setScheduleForm] = useState({ title: '', notes: '', startTime: '09:00', endTime: '10:00' });

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const dateStr = (d) => {
    const dd = d < 10 ? `0${d}` : d;
    const mm = month + 1 < 10 ? `0${month + 1}` : month + 1;
    return `${year}-${mm}-${dd}`;
  };

  const meetingsOnDate = (d) =>
    meetings.filter((m) => m.date === dateStr(d));
  const slotsOnDate = (d) =>
    availabilitySlots.filter((s) => s.date === dateStr(d));
  const hasMeeting = (d) => meetingsOnDate(d).length > 0;
  const hasSlot = (d) => slotsOnDate(d).some((s) => !s.isBooked);

  const selectedMeetings = selectedDate ? meetingsOnDate(selectedDate) : [];
  const selectedSlots = selectedDate ? slotsOnDate(selectedDate) : [];

  const handleAddSlot = () => {
    if (onAddSlot && selectedDate) {
      onAddSlot({ date: dateStr(selectedDate), ...newSlot });
      setShowAddSlot(false);
    }
  };

  const handleSchedule = () => {
    if (onSchedule && selectedDate) {
      onSchedule({ date: dateStr(selectedDate), ...scheduleForm });
      setShowSchedule(false);
      setScheduleForm({ title: '', notes: '', startTime: '09:00', endTime: '10:00' });
    }
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar grid */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-full">
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">
              {MONTHS[month]} {year}
            </h2>
            <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-full">
              <ChevronRight size={20} />
            </button>
          </CardHeader>
          <CardBody className="p-4">
            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {DAYS.map((d) => (
                <div key={d} className="text-center text-xs font-semibold text-gray-500 py-1">
                  {d}
                </div>
              ))}
            </div>
            {/* Date cells */}
            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, i) => {
                if (!day) return <div key={`empty-${i}`} />;
                const isToday =
                  day === today.getDate() &&
                  month === today.getMonth() &&
                  year === today.getFullYear();
                const isSelected = selectedDate === day;
                const hasMeet = hasMeeting(day);
                const hasAvail = hasSlot(day);

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(day)}
                    className={`relative flex flex-col items-center justify-start p-1 rounded-lg min-h-[52px] text-sm font-medium transition-all
                      ${isSelected ? 'bg-primary-600 text-white' : isToday ? 'bg-primary-50 text-primary-700 font-bold' : 'hover:bg-gray-50 text-gray-700'}
                    `}
                  >
                    <span>{day}</span>
                    <div className="flex gap-0.5 mt-1">
                      {hasMeet && (
                        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-primary-500'}`} />
                      )}
                      {hasAvail && (
                        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-yellow-200' : 'bg-yellow-400'}`} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            {/* Legend */}
            <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-500 inline-block" />
                Meeting
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" />
                Available Slot
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Side panel */}
      <div className="space-y-4">
        {selectedDate ? (
          <>
            <Card>
              <CardHeader className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-primary-600" />
                  <span className="font-semibold text-gray-900">
                    {MONTHS[month]} {selectedDate}, {year}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setShowAddSlot((p) => !p)}>
                    <Plus size={14} className="mr-1" /> Slot
                  </Button>
                  <Button size="sm" onClick={() => setShowSchedule((p) => !p)}>
                    <Plus size={14} className="mr-1" /> Meeting
                  </Button>
                </div>
              </CardHeader>

              {/* Add slot form */}
              {showAddSlot && (
                <div className="px-4 pb-4 border-b border-gray-100 space-y-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Add Availability Slot</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-500">Start</label>
                      <input type="time" className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                        value={newSlot.startTime} onChange={(e) => setNewSlot((p) => ({ ...p, startTime: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">End</label>
                      <input type="time" className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                        value={newSlot.endTime} onChange={(e) => setNewSlot((p) => ({ ...p, endTime: e.target.value }))} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleAddSlot}>Save Slot</Button>
                    <Button size="sm" variant="outline" onClick={() => setShowAddSlot(false)}>Cancel</Button>
                  </div>
                </div>
              )}

              {/* Schedule meeting form */}
              {showSchedule && (
                <div className="px-4 pb-4 border-b border-gray-100 space-y-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Schedule Meeting</p>
                  <input className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                    placeholder="Meeting title" value={scheduleForm.title}
                    onChange={(e) => setScheduleForm((p) => ({ ...p, title: e.target.value }))} />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-500">Start</label>
                      <input type="time" className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                        value={scheduleForm.startTime} onChange={(e) => setScheduleForm((p) => ({ ...p, startTime: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">End</label>
                      <input type="time" className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                        value={scheduleForm.endTime} onChange={(e) => setScheduleForm((p) => ({ ...p, endTime: e.target.value }))} />
                    </div>
                  </div>
                  <textarea className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm" rows={2}
                    placeholder="Notes (optional)" value={scheduleForm.notes}
                    onChange={(e) => setScheduleForm((p) => ({ ...p, notes: e.target.value }))} />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSchedule}>Send Request</Button>
                    <Button size="sm" variant="outline" onClick={() => setShowSchedule(false)}>Cancel</Button>
                  </div>
                </div>
              )}

              <CardBody className="space-y-3">
                {/* Available slots */}
                {selectedSlots.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Available Slots</p>
                    {selectedSlots.map((slot) => (
                      <div key={slot.id} className="flex items-center justify-between p-2 bg-yellow-50 border border-yellow-200 rounded-md mb-1">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-yellow-600" />
                          <span className="text-sm">{slot.startTime} – {slot.endTime}</span>
                        </div>
                        <Badge variant={slot.isBooked ? 'error' : 'success'} size="sm">
                          {slot.isBooked ? 'Booked' : 'Open'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}

                {/* Meetings */}
                {selectedMeetings.length > 0 ? (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Meetings</p>
                    {selectedMeetings.map((m) => (
                      <div key={m.id} className="p-3 border border-gray-200 rounded-lg space-y-2">
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-semibold text-gray-900">{m.title}</p>
                          <Badge variant={statusVariant[m.status]} size="sm">
                            {statusLabel[m.status]}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Avatar src={m.requesterAvatar} alt={m.requesterName} size="xs" />
                          <span className="text-xs text-gray-600">{m.requesterName}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock size={12} />
                          {m.startTime} – {m.endTime}
                        </div>
                        {m.notes && <p className="text-xs text-gray-500 italic">{m.notes}</p>}
                        {m.status === 'pending' && (
                          <div className="flex gap-2 pt-1">
                            <Button size="sm" variant="success" onClick={() => onAccept?.(m.id)}>
                              <Check size={14} className="mr-1" /> Accept
                            </Button>
                            <Button size="sm" variant="error" onClick={() => onDecline?.(m.id)}>
                              <X size={14} className="mr-1" /> Decline
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 text-center py-4">No meetings on this day</p>
                )}
              </CardBody>
            </Card>
          </>
        ) : (
          <Card>
            <CardBody className="text-center py-10">
              <Calendar size={36} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">Select a date to view meetings and availability</p>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};
