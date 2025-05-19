import React, { useState } from 'react';
import './RegistrationPage.css';
import { useNavigate } from 'react-router-dom';
import { registerAPI, sendOtpAPI } from './Server/allAPI';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // 👈 import eye icons

const RegisterPage = () => {
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    const {
      fullName,
      email,
      username,
      password,
      confirmPassword,
    } = user;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

   

    const reqBody = {
      fullname: fullName,
      email,
      username,
      password,
    };

    setIsLoading(true);
    try {
      const result = await registerAPI(reqBody);

      if (result.status === 200) {
        if (result.data.message === "user already registered") {
          alert("User already registered. Please login.");
        } else {
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
      <div className="image-container">{/* Optional image */}</div>
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
            Username *
            <input
              type="text"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              required
            />
          </label>

          {/* Password field with eye icon */}
          <label>
            Password *
            <div className="input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                required
              />
              <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </label>

          {/* Confirm password with eye icon */}
          <label>
            Confirm Password *
            <div className="input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                value={user.confirmPassword}
                onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
                required
              />
              <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
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