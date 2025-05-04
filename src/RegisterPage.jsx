import React, { useState } from 'react';
import './RegistrationPage.css';

const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [district, setDistrict] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    // Handle registration logic
  };

  return (
    <div className="register-container">
      <div className="image-container">
      
      </div>
      <div className="form-container">
        <h2>Mineral Management System - Register</h2>
        <form onSubmit={handleRegister}>
          <label>
            Full Name *
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </label>
          <label>
            Email Address *
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Mobile Number *
            <input type="tel" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} required />
          </label>
          <label>
            District *
            <select value={district} onChange={(e) => setDistrict(e.target.value)} required>
              <option value="">Select District</option>
              {/* Add your district options here */}
            </select>
          </label>
          <label>
            Username *
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </label>
          <label>
            Password *
            <input 
              type={showPassword ? 'text' : 'password'} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
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
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
          </label>
          <label>
            
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