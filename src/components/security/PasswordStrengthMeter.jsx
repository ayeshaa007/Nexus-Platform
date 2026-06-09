import React, { useMemo } from 'react';
import { Check, X } from 'lucide-react';

const getStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
    longLength: password.length >= 12,
  };
  score += checks.length ? 1 : 0;
  score += checks.uppercase ? 1 : 0;
  score += checks.lowercase ? 1 : 0;
  score += checks.number ? 1 : 0;
  score += checks.special ? 1 : 0;
  score += checks.longLength ? 1 : 0;

  const levels = [
    { min: 0, max: 1, label: 'Very Weak', color: '#ef4444', bg: 'bg-red-500' },
    { min: 2, max: 2, label: 'Weak', color: '#f97316', bg: 'bg-orange-500' },
    { min: 3, max: 3, label: 'Fair', color: '#eab308', bg: 'bg-yellow-500' },
    { min: 4, max: 4, label: 'Good', color: '#3b82f6', bg: 'bg-blue-500' },
    { min: 5, max: 6, label: 'Strong', color: '#22c55e', bg: 'bg-green-500' },
  ];

  const level = levels.find((l) => score >= l.min && score <= l.max) || levels[0];
  return { score, label: level.label, color: level.color, bg: level.bg, checks };
};

export const PasswordStrengthMeter = ({ password }) => {
  const { score, label, color, bg, checks } = useMemo(() => getStrength(password), [password]);

  if (!password) return null;

  const maxScore = 6;
  const pct = (score / maxScore) * 100;

  const requirements = [
    { key: 'length', label: 'At least 8 characters' },
    { key: 'uppercase', label: 'Uppercase letter (A-Z)' },
    { key: 'lowercase', label: 'Lowercase letter (a-z)' },
    { key: 'number', label: 'Number (0-9)' },
    { key: 'special', label: 'Special character (!@#...)' },
    { key: 'longLength', label: '12+ characters (bonus)' },
  ];

  return (
    <div className="mt-2 space-y-3">
      {/* Bar */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-gray-500">Password strength</span>
          <span className="text-xs font-semibold" style={{ color }}>{label}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${bg}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Requirements checklist */}
      <div className="grid grid-cols-2 gap-1">
        {requirements.map((req) => {
          const met = checks?.[req.key];
          return (
            <div key={req.key} className="flex items-center gap-1.5">
              {met ? (
                <Check size={12} className="text-green-500 flex-shrink-0" />
              ) : (
                <X size={12} className="text-gray-300 flex-shrink-0" />
              )}
              <span
                className={`text-xs ${met ? 'text-green-700' : 'text-gray-400'}`}
              >
                {req.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
