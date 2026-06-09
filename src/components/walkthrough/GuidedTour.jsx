import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, HelpCircle, Compass } from 'lucide-react';
import { Button } from '../ui/Button';

const TOUR_STEPS = [
  {
    target: '[data-tour="dashboard"]',
    title: 'Your Dashboard',
    content: 'This is your main dashboard. See all your pending requests, connections, and upcoming meetings at a glance.',
    position: 'right',
  },
  {
    target: '[data-tour="calendar"]',
    title: 'Meeting Calendar',
    content: 'Schedule and manage meetings with investors or entrepreneurs. Add your availability and accept meeting requests here.',
    position: 'right',
  },
  {
    target: '[data-tour="videocall"]',
    title: 'Video Calls',
    content: 'Join or start video calls with your connections. Confirmed meetings appear here automatically.',
    position: 'right',
  },
  {
    target: '[data-tour="documents"]',
    title: 'Document Chamber',
    content: 'Upload, review, and digitally sign contracts and deal documents. Track signature status in real time.',
    position: 'right',
  },
  {
    target: '[data-tour="payments"]',
    title: 'Payments & Wallet',
    content: 'Manage your Nexus wallet, send and receive funds, and track your transaction history.',
    position: 'right',
  },
  {
    target: '[data-tour="security"]',
    title: 'Security Center',
    content: 'Enable two-factor authentication, check active sessions, and manage your role-based access permissions.',
    position: 'right',
  },
];

// Floating tooltip that follows target element
const Tooltip = ({ step, current, total, onNext, onPrev, onClose, anchor }) => {
  const tooltipRef = useRef(null);
  const [pos, setPos] = useState({ top: 120, left: 260 });

  useEffect(() => {
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    const scrollY = window.scrollY;
    const newTop = rect.top + scrollY + rect.height / 2 - 80;
    const newLeft = rect.right + 16;
    setPos({ top: Math.max(16, newTop), left: Math.min(newLeft, window.innerWidth - 320) });
    anchor.classList.add('ring-2', 'ring-primary-500', 'ring-offset-2', 'rounded-lg', 'z-50');
    return () => {
      anchor.classList.remove('ring-2', 'ring-primary-500', 'ring-offset-2', 'rounded-lg', 'z-50');
    };
  }, [anchor]);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 pointer-events-none" style={{ background: 'rgba(0,0,0,0.25)' }} />

      {/* Tooltip box */}
      <div
        ref={tooltipRef}
        className="fixed z-50 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 animate-fade-in"
        style={{ top: pos.top, left: pos.left }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {current + 1}
            </div>
            <h4 className="text-sm font-semibold text-gray-900">{step.title}</h4>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full text-gray-400">
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 pb-3">
          <p className="text-sm text-gray-600 leading-relaxed">{step.content}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 pb-4 pt-2 border-t border-gray-100">
          <div className="flex gap-1">
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? 'bg-primary-600 w-4' : 'bg-gray-300'}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            {current > 0 && (
              <Button size="sm" variant="outline" onClick={onPrev}>
                <ChevronLeft size={14} />
              </Button>
            )}
            {current < total - 1 ? (
              <Button size="sm" onClick={onNext}>
                Next <ChevronRight size={14} />
              </Button>
            ) : (
              <Button size="sm" onClick={onClose}>
                Finish <ChevronRight size={14} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export const GuidedTour = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  const findAnchor = (selector) => {
    try {
      return document.querySelector(selector);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const step = TOUR_STEPS[currentStep];
    const el = findAnchor(step.target);
    setAnchorEl(el);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [isOpen, currentStep]);

  const startTour = () => {
    setCurrentStep(0);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setAnchorEl(null);
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={startTour}
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-full shadow-lg transition-all hover:scale-105 text-sm font-medium"
        title="Start guided tour"
      >
        <Compass size={18} />
        <span className="hidden sm:inline">Tour</span>
      </button>

      {/* Tour overlay */}
      {isOpen && (
        <Tooltip
          step={TOUR_STEPS[currentStep]}
          current={currentStep}
          total={TOUR_STEPS.length}
          anchor={anchorEl}
          onNext={() => setCurrentStep((p) => Math.min(p + 1, TOUR_STEPS.length - 1))}
          onPrev={() => setCurrentStep((p) => Math.max(p - 1, 0))}
          onClose={handleClose}
        />
      )}
    </>
  );
};
