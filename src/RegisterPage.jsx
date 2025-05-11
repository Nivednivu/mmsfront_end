import React, { useState } from 'react';
import './RegistrationPage.css';
import { useNavigate } from 'react-router-dom';
import { registerAPI, sendOtpAPI } from './Server/allAPI';

const RegisterPage = () => {
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    district: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    const {
      fullName,
      email,
      mobileNumber,
      district,
      username,
      password,
      confirmPassword,
    } = user;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!agreedToTerms) {
      alert("Please agree to the terms and conditions.");
      return;
    }

    const reqBody = {
      fullname: fullName,
      email,
      mobilenumber: mobileNumber,
      district,
      username,
      password,
    };

    setIsLoading(true);
    try {
      // First register the user
      const result = await registerAPI(reqBody);

      if (result.status === 200) {
        if (result.data.message === "user already registered") {
          alert("User already registered. Please login.");
        } else {
          // If registration successful, send OTP
          const otpResponse = await sendOtpAPI({ email });
          
          if (otpResponse.status === 200) {
            alert("OTP sent to your email. Please verify to complete registration.");
            navigate('/register-otp', { state: { email } });
          } else {
            alert("Failed to send OTP. Please try again.");
          }
        }
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.response?.data?.message || "Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="image-container">
        {/* Optional image or design */}
      </div>
      <div className="form-container">
        <h2>Mineral Management System - Register</h2>
        <form onSubmit={handleRegister}>
          <label>
            Full Name *
            <input
              type="text"
              value={user.fullName}
              onChange={(e) => setUser({ ...user, fullName: e.target.value })}
              required
            />
          </label>
          <label>
            Email Address *
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
            />
          </label>
          <label>
            Mobile Number *
            <input
              type="tel"
              value={user.mobileNumber}
              onChange={(e) => setUser({ ...user, mobileNumber: e.target.value })}
              required
            />
          </label>
          <label>
            District *
            <select
              value={user.district}
              onChange={(e) => setUser({ ...user, district: e.target.value })}
              required
            >
              <option value="">Select District</option>
              <option value="District A">District A</option>
              <option value="District B">District B</option>
              <option value="District C">District C</option>
            </select>
          </label>
          <label>
            Username *
            <input
              type="text"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              required
            />
          </label>
          <label>
            Password *
            <input
              type={showPassword ? 'text' : 'password'}
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </label>
          <label>
            Confirm Password *
            <input
              type={showPassword ? 'text' : 'password'}
              value={user.confirmPassword}
              onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
              required
            />
          </label>
          <label className="terms-label">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              required
            />
            I agree to the Terms and Conditions *
          </label>
          <button type="submit" className="register-button" disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Register'}
          </button>
        </form>
        <p className="login-link">
          Already registered? <a href="/">Login here</a>
        </p>
                  <a className="forgot" href="/forgotp">Forgot Password</a>

      </div>
    </div>
  );
};

export default RegisterPage;