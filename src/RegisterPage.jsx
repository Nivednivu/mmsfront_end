import React, { useState, useEffect } from 'react';
import './RegistrationPage.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateAdminWithCredentials } from './Server/allAPI';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const RegisterPage = () => {
  const location = useLocation();
  const { newUserData } = location.state || {};
  
  const [user, setUser] = useState({
    fullName: newUserData?.lesseeName || '',
    email: '',
    username: newUserData?.lesseeId || '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (newUserData) {
      setUser(prev => ({
        ...prev,
        fullName: newUserData.lesseeName || '',
        username: newUserData.lesseeId || ''
      }));
    }
  }, [newUserData]);

  const handleRegister = async (e) => {
    e.preventDefault();

    const { fullName, email, username, password, confirmPassword } = user;

    if (!fullName || !email || !username || !password) {
      alert("Please fill all required fields!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!newUserData?._id) {
      alert("No user ID found. Please start the registration process from the beginning.");
      return;
    }

    const reqBody = {
      userId: newUserData._id,
      fullname: fullName,
      email,
      lesseeId: username,
      password
    };

    setIsLoading(true);
    try {
      const result = await updateAdminWithCredentials(reqBody);

      if (result.status === 200) {
        alert("Registration successful! You can now login.");
        navigate('/');
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
    <div style={{marginRight:'600px'}} className="register-container">
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
              disabled={!!newUserData?.lesseeName}
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
            Lessee ID *
            <input
              type="text"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              required
              disabled={!!newUserData?.lesseeId}
            />
          </label>

          <label>
            Password *
            <div className="input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                required
                minLength="6"
              />
              <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </label>

          <label>
            Confirm Password *
            <div className="input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                value={user.confirmPassword}
                onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
                required
                minLength="6"
              />
              <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </label>

          <button 
            type="submit" 
            className="register-button" 
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Complete Registration'}
          </button>
        </form>

        <p className="login-link">
          Already registered? <a href="/">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;