import React, { useState } from 'react';
import {
  Shield, Lock, Smartphone, Eye, EyeOff, CheckCircle, AlertCircle,
  Key, LogOut, Activity, Globe,
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { PasswordStrengthMeter } from '../../components/security/PasswordStrengthMeter';
import { TwoFactorModal } from '../../components/security/TwoFactorModal';
import { useAuth } from '../../context/AuthContext';

export const SecurityPage = () => {
  const { user } = useAuth();
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [showTwoFAModal, setShowTwoFAModal] = useState(false);
  const [setupMode, setSetupMode] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    current: '', new: '', confirm: '',
  });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [passwordMsg, setPasswordMsg] = useState('');

  const setField = (k) => (e) => setPasswordForm((p) => ({ ...p, [k]: e.target.value }));
  const toggleShow = (k) => setShowPasswords((p) => ({ ...p, [k]: !p[k] }));

  const handleChangePassword = () => {
    if (!passwordForm.current) { setPasswordMsg('Enter your current password.'); return; }
    if (passwordForm.new.length < 8) { setPasswordMsg('New password must be at least 8 characters.'); return; }
    if (passwordForm.new !== passwordForm.confirm) { setPasswordMsg('Passwords do not match.'); return; }
    setPasswordMsg('success');
    setPasswordForm({ current: '', new: '', confirm: '' });
    setTimeout(() => setPasswordMsg(''), 3000);
  };

  const handle2FAVerified = () => {
    setShowTwoFAModal(false);
    setTwoFAEnabled(true);
  };

  const activeSessions = [
    { device: 'Chrome on Windows', ip: '192.168.1.1', location: 'Karachi, PK', current: true, time: 'Now' },
    { device: 'Safari on iPhone', ip: '10.0.0.2', location: 'Karachi, PK', current: false, time: '2h ago' },
    { device: 'Firefox on Mac', ip: '203.44.12.1', location: 'Lahore, PK', current: false, time: '1d ago' },
  ];

  // Role-based permissions table
  const permissions = user?.role === 'investor'
    ? [
        { feature: 'View Startups', access: true },
        { feature: 'Send Collaboration Requests', access: true },
        { feature: 'Access Deal Flow', access: true },
        { feature: 'Document Chamber (full)', access: true },
        { feature: 'View Investor Wallets', access: true },
        { feature: 'Manage Team Members', access: false },
        { feature: 'Receive Funding Requests', access: false },
      ]
    : [
        { feature: 'View Investors', access: true },
        { feature: 'Receive Collaboration Requests', access: true },
        { feature: 'Upload Documents', access: true },
        { feature: 'Document Chamber (read)', access: true },
        { feature: 'Manage Startup Profile', access: true },
        { feature: 'Send Funding Requests', access: true },
        { feature: 'Access Deal Analytics', access: false },
      ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Security & Access</h1>
        <p className="text-gray-600">Manage your account security, 2FA, and role-based access</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Password section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock size={18} className="text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            {passwordMsg === 'success' && (
              <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm">
                <CheckCircle size={15} /> Password updated successfully!
              </div>
            )}
            {passwordMsg && passwordMsg !== 'success' && (
              <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm">
                <AlertCircle size={15} /> {passwordMsg}
              </div>
            )}

            {[
              { key: 'current', label: 'Current Password' },
              { key: 'new', label: 'New Password' },
              { key: 'confirm', label: 'Confirm New Password' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <div className="relative">
                  <input
                    type={showPasswords[key] ? 'text' : 'password'}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:border-primary-500"
                    placeholder="••••••••"
                    value={passwordForm[key]}
                    onChange={setField(key)}
                  />
                  <button
                    type="button"
                    onClick={() => toggleShow(key)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords[key] ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {key === 'new' && passwordForm.new && (
                  <PasswordStrengthMeter password={passwordForm.new} />
                )}
              </div>
            ))}

            <Button onClick={handleChangePassword} leftIcon={<Key size={15} />}>
              Update Password
            </Button>
          </CardBody>
        </Card>

        {/* 2FA section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Smartphone size={18} className="text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-xl bg-gray-50">
              <div>
                <p className="text-sm font-medium text-gray-900">2FA Status</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {twoFAEnabled
                    ? 'Your account is protected with two-factor authentication.'
                    : 'Protect your account with an extra layer of security.'}
                </p>
              </div>
              <Badge variant={twoFAEnabled ? 'success' : 'error'}>
                {twoFAEnabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>

            {!twoFAEnabled ? (
              <Button
                leftIcon={<Shield size={15} />}
                onClick={() => { setSetupMode(true); setShowTwoFAModal(true); }}
              >
                Enable 2FA
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-800">2FA is active</p>
                    <p className="text-xs text-green-600 mt-0.5">
                      You'll be asked for a verification code each time you log in.
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  leftIcon={<Smartphone size={15} />}
                  onClick={() => { setSetupMode(false); setShowTwoFAModal(true); }}
                >
                  Test 2FA
                </Button>
                <Button
                  variant="error"
                  size="sm"
                  onClick={() => setTwoFAEnabled(false)}
                >
                  Disable 2FA
                </Button>
              </div>
            )}

            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Backup Options</p>
              {[
                { label: 'Authenticator App', active: twoFAEnabled },
                { label: 'SMS to ••••42', active: false },
                { label: 'Backup Codes', active: false },
              ].map((opt) => (
                <div key={opt.label} className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-700">{opt.label}</span>
                  <Badge variant={opt.active ? 'success' : 'gray'} size="sm">
                    {opt.active ? 'Active' : 'Setup'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Active sessions */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">Active Sessions</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-3">
            {activeSessions.map((session, i) => (
              <div
                key={i}
                className={`flex items-center justify-between p-3 rounded-xl border
                  ${session.current ? 'border-primary-200 bg-primary-50' : 'border-gray-200'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${session.current ? 'bg-primary-100' : 'bg-gray-100'}`}>
                    <Globe size={16} className={session.current ? 'text-primary-600' : 'text-gray-500'} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{session.device}</p>
                    <p className="text-xs text-gray-500">{session.ip} · {session.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  {session.current ? (
                    <Badge variant="success" size="sm">Current</Badge>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-xs text-gray-400">{session.time}</p>
                      <button className="text-xs text-red-500 hover:underline flex items-center gap-1">
                        <LogOut size={10} /> Revoke
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Role-based access */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900">Role-Based Access</h2>
              </div>
              <Badge variant="primary" size="sm">
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'User'}
              </Badge>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-sm text-gray-500 mb-4">
              Permissions available for your <strong className="text-gray-700">{user?.role}</strong> role:
            </p>
            <div className="space-y-2">
              {permissions.map(({ feature, access }) => (
                <div key={feature} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-gray-700">{feature}</span>
                  {access ? (
                    <CheckCircle size={16} className="text-green-500" />
                  ) : (
                    <AlertCircle size={16} className="text-gray-300" />
                  )}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* 2FA Modal */}
      {showTwoFAModal && (
        <TwoFactorModal
          isSetup={setupMode}
          onVerify={handle2FAVerified}
          onClose={() => setShowTwoFAModal(false)}
        />
      )}
    </div>
  );
};
