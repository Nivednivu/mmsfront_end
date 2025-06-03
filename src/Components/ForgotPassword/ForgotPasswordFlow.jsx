import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPasswordPage.css';
import { resetPasswordAPI, sendOtpAPI, verifyOtpAPI } from '../../Server/allAPI';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const showMessage = (text, type = 'error') => {
    setMessage({ text, type });
  };

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      return showMessage('Please enter a valid email');
    }

    setLoading(true);
    try {
      const res = await sendOtpAPI({ email });
              setStep(2);

      if (res?.data?.success) {
        showMessage(`OTP sent to ${email}`, 'success');
      } else {
        showMessage(res?.data?.message || 'Failed to send OTP');
      }
    } catch (err) {
      showMessage(err?.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      return showMessage('Enter a valid 6-digit OTP');
    }

    setLoading(true);
    try {
      const res = await verifyOtpAPI({ email, otp });
              setStep(3);

      if (res?.data?.success) {
        showMessage('OTP verified. Set your new password.', 'success');
      } else {
        showMessage(res?.data?.message || 'Invalid OTP');
      }
    } catch (err) {
      showMessage(err?.response?.data?.error || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      return showMessage('Password must be at least 8 characters');
    }
    if (newPassword !== confirmPassword) {
      return showMessage('Passwords do not match');
    }

    setLoading(true);
    try {
      const res = await resetPasswordAPI({ email, newPassword });
              setTimeout(() => navigate('/'), 2000);

      if (res?.data?.success) {
        showMessage('Password updated. Redirecting...', 'success');
      } else {
        showMessage(res?.data?.message || 'Failed to reset password');
      }
    } catch (err) {
      showMessage(err?.response?.data?.error || 'Error resetting password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2>Forgot Password</h2>

        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <div className="form-group">
              <label>Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                }
                required
              />
              <small>Sent to: {email}</small>
            </div>
            <button type="submit" disabled={loading || otp.length !== 6}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button type="button" onClick={handleSendOtp} disabled={loading}>
              Resend OTP
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || newPassword !== confirmPassword}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}

        <div className="back-to-login">
          Remembered your password? <a href="/">Login here</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
