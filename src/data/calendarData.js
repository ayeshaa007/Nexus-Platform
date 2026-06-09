// Mock availability slots and meeting requests

export const availabilitySlots = [
  { id: 'slot1', date: '2026-06-09', startTime: '09:00', endTime: '10:00', isBooked: false },
  { id: 'slot2', date: '2026-06-09', startTime: '14:00', endTime: '15:00', isBooked: true },
  { id: 'slot3', date: '2026-06-10', startTime: '10:00', endTime: '11:00', isBooked: false },
  { id: 'slot4', date: '2026-06-11', startTime: '15:00', endTime: '16:00', isBooked: false },
  { id: 'slot5', date: '2026-06-12', startTime: '09:00', endTime: '10:00', isBooked: true },
];

export const meetingRequests = [
  {
    id: 'meet1',
    title: 'TechWave AI – Series A Discussion',
    requesterId: 'i1',
    requesterName: 'Michael Rodriguez',
    requesterAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    date: '2026-06-09',
    startTime: '14:00',
    endTime: '15:00',
    status: 'confirmed',
    notes: 'Discuss financial model and runway.',
    type: 'investor-entrepreneur',
  },
  {
    id: 'meet2',
    title: 'HealthPulse Investment Call',
    requesterId: 'i3',
    requesterName: 'Robert Torres',
    requesterAvatar: 'https://images.pexels.com/photos/834863/pexels-photo-834863.jpeg',
    date: '2026-06-12',
    startTime: '09:00',
    endTime: '10:00',
    status: 'confirmed',
    notes: 'Initial call to understand product-market fit.',
    type: 'investor-entrepreneur',
  },
  {
    id: 'meet3',
    title: 'GreenLife Portfolio Review',
    requesterId: 'i2',
    requesterName: 'Jennifer Lee',
    requesterAvatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
    date: '2026-06-14',
    startTime: '11:00',
    endTime: '12:00',
    status: 'pending',
    notes: 'Review Q1 metrics and expansion plan.',
    type: 'investor-entrepreneur',
  },
  {
    id: 'meet4',
    title: 'UrbanFarm Intro Call',
    requesterId: 'e4',
    requesterName: 'James Wilson',
    requesterAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    date: '2026-06-16',
    startTime: '13:00',
    endTime: '14:00',
    status: 'pending',
    notes: 'Intro pitch and demo.',
    type: 'investor-entrepreneur',
  },
];

export const addMeetingRequest = (meeting) => {
  const newMeeting = {
    ...meeting,
    id: `meet${meetingRequests.length + 1}`,
    status: 'pending',
  };
  meetingRequests.push(newMeeting);
  return newMeeting;
};

export const updateMeetingStatus = (id, status) => {
  const idx = meetingRequests.findIndex((m) => m.id === id);
  if (idx !== -1) meetingRequests[idx].status = status;
};

export const addAvailabilitySlot = (slot) => {
  const newSlot = { ...slot, id: `slot${availabilitySlots.length + 1}`, isBooked: false };
  availabilitySlots.push(newSlot);
  return newSlot;
};
