import React, { useState, useRef, useEffect } from 'react';
import { Shield, X, RefreshCw, Check, AlertCircle, Smartphone } from 'lucide-react';
import { Button } from '../ui/Button';

export const TwoFactorModal = ({ onVerify, onClose, isSetup = false }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const inputRefs = useRef([]);

  // Mock OTP for demo
  const DEMO_OTP = '123456';

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    // Auto-verify when all filled
    if (newOtp.every((d) => d !== '') && value) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      handleVerify(pasted);
    }
  };

  const handleVerify = async (code = otp.join('')) => {
    if (code.length < 6) { setError('Enter all 6 digits.'); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    if (code === DEMO_OTP) {
      setLoading(false);
      onVerify?.();
    } else {
      setOtp(['', '', '', '', '', '']);
      setError('Incorrect code. Try 123456 for demo.');
      setLoading(false);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    setResent(true);
    await new Promise((r) => setTimeout(r, 1000));
    setResent(false);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              {isSetup ? 'Enable 2FA' : 'Two-Factor Verification'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Icon */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-50 mb-3">
              <Smartphone size={26} className="text-primary-600" />
            </div>
            <p className="text-sm text-gray-600">
              {isSetup
                ? 'A 6-digit code has been sent to your phone number ending in ••••42.'
                : 'Enter the 6-digit verification code from your authenticator app or SMS.'}
            </p>
            <p className="text-xs text-gray-400 mt-1">Demo code: <strong>123456</strong></p>
          </div>

          {/* OTP inputs */}
          <div className="flex justify-center gap-2">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={i === 0 ? handlePaste : undefined}
                className={`w-11 h-12 text-center text-lg font-bold border-2 rounded-xl outline-none transition-all
                  ${digit ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-300 text-gray-900'}
                  ${error ? 'border-red-400 bg-red-50' : ''}
                  focus:border-primary-500 focus:bg-primary-50`}
              />
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          {/* Verify button */}
          <Button
            fullWidth
            isLoading={loading}
            disabled={otp.some((d) => d === '') || loading}
            onClick={() => handleVerify()}
            leftIcon={<Check size={15} />}
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </Button>

          {/* Resend */}
          <div className="text-center">
            <button
              onClick={handleResend}
              disabled={resent}
              className="text-sm text-primary-600 hover:underline flex items-center gap-1.5 mx-auto disabled:opacity-50"
            >
              <RefreshCw size={14} className={resent ? 'animate-spin' : ''} />
              {resent ? 'Code resent!' : "Didn't receive a code? Resend"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
