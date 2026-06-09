import React, { useState } from 'react';
import { Phone, Video, Calendar, User } from 'lucide-react';
import { VideoCall } from '../../components/videocall/VideoCall';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { users } from '../../data/users';
import { meetingRequests } from '../../data/calendarData';

export const VideoCallPage = () => {
  const [activeCall, setActiveCall] = useState(null);
  const [activeParticipant, setActiveParticipant] = useState(null);

  const confirmedMeetings = meetingRequests.filter((m) => m.status === 'confirmed');

  const startCall = (meeting) => {
    const participant = users.find((u) => u.id === meeting.requesterId) || {
      id: meeting.requesterId,
      name: meeting.requesterName,
      avatarUrl: meeting.requesterAvatar,
    };
    setActiveParticipant(participant);
    setActiveCall(meeting);
  };

  const endCall = () => {
    setActiveCall(null);
    setActiveParticipant(null);
  };

  // Quick-dial contacts (other users)
  const contacts = users.slice(0, 4);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Video Calls</h1>
        <p className="text-gray-600">
          Connect face-to-face with investors and entrepreneurs
        </p>
      </div>

      {activeCall ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 font-medium">
              In call: <span className="text-primary-600">{activeCall.title}</span>
            </p>
            <Button variant="error" size="sm" onClick={endCall}>
              End &amp; Return
            </Button>
          </div>
          <VideoCall participant={activeParticipant} onEnd={endCall} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scheduled calls */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-primary-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Scheduled Meetings</h2>
                </div>
              </CardHeader>
              <CardBody>
                {confirmedMeetings.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <Video size={36} className="mx-auto mb-3" />
                    <p>No confirmed meetings yet. Check your Calendar page.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {confirmedMeetings.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={m.requesterAvatar}
                            alt={m.requesterName}
                            size="md"
                            status="online"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{m.title}</p>
                            <p className="text-sm text-gray-500">
                              {m.date} · {m.startTime}–{m.endTime}
                            </p>
                            {m.notes && (
                              <p className="text-xs text-gray-400 mt-0.5">{m.notes}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="success" size="sm">Confirmed</Badge>
                          <Button
                            size="sm"
                            leftIcon={<Video size={14} />}
                            onClick={() => startCall(m)}
                          >
                            Join
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Quick dial */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Phone size={18} className="text-primary-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Quick Dial</h2>
                </div>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-2 gap-3">
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar
                          src={contact.avatarUrl}
                          alt={contact.name}
                          size="sm"
                          status={contact.isOnline ? 'online' : 'offline'}
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{contact.role}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          startCall({
                            id: `quick-${contact.id}`,
                            title: `Call with ${contact.name}`,
                            requesterId: contact.id,
                            requesterName: contact.name,
                            requesterAvatar: contact.avatarUrl,
                          })
                        }
                      >
                        <Video size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* How it works */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">How It Works</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                {[
                  {
                    icon: <Calendar size={18} className="text-primary-600" />,
                    title: 'Schedule a Meeting',
                    desc: 'Use the Calendar page to schedule and confirm meetings.',
                  },
                  {
                    icon: <Video size={18} className="text-primary-600" />,
                    title: 'Join the Call',
                    desc: 'Click "Join" on a confirmed meeting to start the video call.',
                  },
                  {
                    icon: <User size={18} className="text-primary-600" />,
                    title: 'Collaborate',
                    desc: 'Use chat, screen sharing, and participant management in-call.',
                  },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0">{step.icon}</div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{step.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>

            <Card>
              <CardBody className="text-center py-6">
                <Video size={32} className="mx-auto text-primary-400 mb-3" />
                <p className="text-sm font-medium text-gray-700 mb-1">Start an Instant Call</p>
                <p className="text-xs text-gray-500 mb-4">
                  Invite someone directly without scheduling
                </p>
                <Button
                  fullWidth
                  leftIcon={<Video size={16} />}
                  onClick={() =>
                    startCall({
                      id: 'instant',
                      title: 'Instant Meeting',
                      requesterId: users[0].id,
                      requesterName: users[0].name,
                      requesterAvatar: users[0].avatarUrl,
                    })
                  }
                >
                  New Instant Meeting
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
