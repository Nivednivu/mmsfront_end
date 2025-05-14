import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOtpAPI } from '../Server/allAPI';
import './RegisterOtp.css';

function RegisterOtp() {
  const [otp, setOtp] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const response = await verifyOtpAPI({ email, otp });

      if (response.status === 200) {
        alert('OTP Verified Successfully!');
        navigate('/userdasboard'); // Navigate to next page
      } else {
        alert(response.data?.error || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      alert('Server error. Please try again later.');
    }
  };

  return (
    <div className="otp-container">
      <h2>OTP Verification</h2>
      <p>We’ve sent an OTP to your email: <strong>{email}</strong></p>
      <form onSubmit={handleVerify}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button type="submit">Verify OTP</button>
      </form>
    </div>
  );
}

export default RegisterOtp;
