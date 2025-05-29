import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { loginAPI } from './Server/allAPI';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginUser, setLoginUser] = useState({ username: '', password: '' });

  const navigate = useNavigate()
  const handleLogin = async (e) => {
    e.preventDefault();

    const { username, password } = loginUser;

    if (!username || !password) {
      alert("Please enter both username and password");
      return;
    }

    try {
      const result = await loginAPI({ username, password });

      if (result.status === 200) {
        alert("Login successful!");
        // Store token or navigate to dashboard if needed
        // localStorage.setItem("token", result.data.token)
        
         navigate('/userdasboard')
      } else {
        alert("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("not invalid username password.");
    }
  };

  return (
    <div className="login-container">
      <div className="image-container">
        {/* <img style={{ width: '210px', height: '580px' }} src="https://storage.googleapis.com/a1aa/image/2588ea77-81c1-4f7a-2247-9dceadfbd0e7.jpg" alt="Construction Site" /> */}
      </div>

      <div className="form-container">
        <div className="logo">
        </div>
        <h2>Mineral Management System</h2>
        <form onSubmit={handleLogin}>
          <label>
            Username *
            <input
              type="text"
              value={loginUser.username}
              onChange={(e) => setLoginUser({ ...loginUser, username: e.target.value })}
              required
            />
          </label>
         <label>
  Password *
  <div className="password-wrapper left-icon" style={{width:'380px'}}>
    <span
      className="password-toggle-icon"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? <FaEyeSlash/> : <FaEye/>}
    </span>
    <input
      type={showPassword ? 'text' : 'password'}
      value={loginUser.password}
      onChange={(e) => setLoginUser({ ...loginUser, password: e.target.value })}
      required
    />
  </div>
</label>
          <button type="submit" className="login-button">Login</button>
          {/* <button type="button" className="other-payment-button">Other Payment</button> */}
        </form>
        <p className="register-link">
          Not Registered? <a className="reg" href="/Register">Register</a>
          <a className='admin' href="/admin">Admin</a>
          <a className="forgot" href="/forgotp">Forgot Password</a>
        </p>
      </div>
    </div>
  );
};

export default Login;