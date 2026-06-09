import React, { useState, useRef, useEffect } from 'react';
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, Monitor, MonitorOff,
  MessageCircle, Users, MoreVertical, Maximize2, Minimize2,
} from 'lucide-react';

const ControlBtn = ({ onClick, active, danger, children, label }) => (
  <button
    onClick={onClick}
    title={label}
    className={`flex flex-col items-center gap-1 group`}
  >
    <span
      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all
        ${danger
          ? 'bg-red-500 hover:bg-red-600 text-white'
          : active
            ? 'bg-gray-600 hover:bg-gray-500 text-white'
            : 'bg-white/20 hover:bg-white/30 text-white'
        }`}
    >
      {children}
    </span>
    <span className="text-xs text-white/70 group-hover:text-white">{label}</span>
  </button>
);

export const VideoCall = ({ participant, onEnd }) => {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenShare, setScreenShare] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: participant?.name || 'Participant', text: 'Ready to start?', time: '0:00' },
  ]);
  const [newMsg, setNewMsg] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setCallDuration((d) => d + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const formatDuration = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const handleSendMsg = (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { id: prev.length + 1, sender: 'You', text: newMsg, time: formatDuration(callDuration) },
    ]);
    setNewMsg('');
  };

  return (
    <div
      className={`relative bg-gray-900 rounded-2xl overflow-hidden flex flex-col
        ${fullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-[600px]'}`}
    >
      {/* Main video area */}
      <div className="flex-1 relative flex">
        {/* Remote video (participant) */}
        <div className="flex-1 relative bg-gray-800 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-primary-600 flex items-center justify-center mx-auto mb-3 text-white text-3xl font-bold">
              {participant?.name?.[0] || 'P'}
            </div>
            <p className="text-white text-lg font-medium">{participant?.name || 'Participant'}</p>
            <p className="text-white/50 text-sm mt-1">
              {camOn ? 'Camera On' : 'Camera Off'}
            </p>
          </div>
          {/* Simulated video background */}
          <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-blue-500 to-purple-600" />
        </div>

        {/* Self preview (picture-in-picture) */}
        <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-700 rounded-xl overflow-hidden border-2 border-gray-600 flex items-center justify-center">
          {camOn ? (
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center mx-auto text-white text-sm font-bold">
                You
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <VideoOff size={18} className="text-gray-400" />
              <span className="text-xs text-gray-400">Camera off</span>
            </div>
          )}
        </div>

        {/* Status bar */}
        <div className="absolute top-4 left-4 flex items-center gap-3">
          <div className="flex items-center gap-2 bg-black/40 rounded-full px-3 py-1.5">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-white text-sm font-medium">{formatDuration(callDuration)}</span>
          </div>
          {screenShare && (
            <div className="flex items-center gap-1.5 bg-green-500/80 rounded-full px-3 py-1.5">
              <Monitor size={14} className="text-white" />
              <span className="text-white text-xs">Sharing screen</span>
            </div>
          )}
        </div>

        {/* Top right controls */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setFullscreen((p) => !p)}
            className="w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white"
          >
            {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>

        {/* Sidebar panels */}
        {(chatOpen || participantsOpen) && (
          <div className="w-72 bg-gray-900 border-l border-gray-700 flex flex-col">
            {chatOpen && (
              <>
                <div className="px-4 py-3 border-b border-gray-700">
                  <p className="text-white font-semibold text-sm">In-call Chat</p>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`${msg.sender === 'You' ? 'text-right' : ''}`}>
                      <p className="text-xs text-white/50 mb-0.5">{msg.sender} · {msg.time}</p>
                      <span
                        className={`inline-block text-sm px-3 py-1.5 rounded-lg max-w-[90%] text-left
                          ${msg.sender === 'You' ? 'bg-primary-600 text-white' : 'bg-gray-700 text-white'}`}
                      >
                        {msg.text}
                      </span>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendMsg} className="p-3 border-t border-gray-700 flex gap-2">
                  <input
                    className="flex-1 bg-gray-800 text-white text-sm rounded-lg px-3 py-2 outline-none border border-gray-700 focus:border-primary-500"
                    placeholder="Type a message..."
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                  />
                  <button type="submit" className="px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded-lg">
                    Send
                  </button>
                </form>
              </>
            )}
            {participantsOpen && !chatOpen && (
              <>
                <div className="px-4 py-3 border-b border-gray-700">
                  <p className="text-white font-semibold text-sm">Participants (2)</p>
                </div>
                <div className="p-3 space-y-2">
                  {[
                    { name: 'You', status: 'mic_on' },
                    { name: participant?.name || 'Participant', status: 'mic_on' },
                  ].map((p) => (
                    <div key={p.name} className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-800">
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {p.name[0]}
                      </div>
                      <span className="text-white text-sm flex-1">{p.name}</span>
                      <Mic size={14} className="text-white/60" />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Controls bar */}
      <div className="bg-gray-900 px-6 py-4 flex items-center justify-center gap-6 border-t border-gray-800">
        <ControlBtn onClick={() => setMicOn((p) => !p)} active={!micOn} label={micOn ? 'Mute' : 'Unmute'}>
          {micOn ? <Mic size={20} /> : <MicOff size={20} />}
        </ControlBtn>

        <ControlBtn onClick={() => setCamOn((p) => !p)} active={!camOn} label={camOn ? 'Stop Video' : 'Start Video'}>
          {camOn ? <Video size={20} /> : <VideoOff size={20} />}
        </ControlBtn>

        <ControlBtn onClick={() => setScreenShare((p) => !p)} active={screenShare} label={screenShare ? 'Stop Share' : 'Share Screen'}>
          {screenShare ? <MonitorOff size={20} /> : <Monitor size={20} />}
        </ControlBtn>

        <ControlBtn onClick={() => { setChatOpen((p) => !p); setParticipantsOpen(false); }} active={chatOpen} label="Chat">
          <MessageCircle size={20} />
        </ControlBtn>

        <ControlBtn onClick={() => { setParticipantsOpen((p) => !p); setChatOpen(false); }} active={participantsOpen} label="People">
          <Users size={20} />
        </ControlBtn>

        <ControlBtn danger onClick={onEnd} label="End Call">
          <PhoneOff size={20} />
        </ControlBtn>
      </div>
    </div>
  );
};
