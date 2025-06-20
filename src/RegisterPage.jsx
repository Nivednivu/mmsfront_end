import React, { useState, useEffect } from 'react';
import './RegistrationPage.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { adminAddQuaeyAPI, updateAdminWithCredentials } from './Server/allAPI';
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

  const [formData, setFormData] = useState(newUserData || {});
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true);
    try {
      // First create the admin query entry
      const submissionData = {
        ...formData,
        SerialNo: (parseInt(formData.SerialNo) - 1).toString(),
        dispatchNo: (parseInt(formData.dispatchNo) - 1).toString()
      };

      const queryResponse = await adminAddQuaeyAPI(submissionData);
      
      if (queryResponse.status !== 201) {
        throw new Error('Failed to save query data');
      }

      // Then register the user credentials
      const reqBody = {
        userId: queryResponse.data.data._id,
        fullname: fullName,
        email,
        lesseeId: username,
        password
      };

      const result = await updateAdminWithCredentials(reqBody);

      if (result.status === 200) {
        alert("Registration successful! You can now login.");
        navigate('/');
      } else {
        throw new Error('Failed to register user');
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.response?.data?.message || "Registration failed. Please try again.");
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