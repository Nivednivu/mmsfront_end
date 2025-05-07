import React, { useState } from 'react';
import './RegistrationPage.css';
import { registerAPI } from './Server/allAPI';

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

  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

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

    try {
      const result = await registerAPI(reqBody);

      if (result.status === 200) {
        if (result.data.message === "user already register") {
          alert("User already registered. Please login.");
        } else {
          alert("Registration successful!");
          window.location.href = "/";
        }
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Server error. Please try again later.");
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
              {/* Add more district options as needed */}
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
          <button type="submit" className="register-button">Register</button>
        </form>
        <p className="login-link">
          Not yet registered? <a href="/login">Back to Login</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
