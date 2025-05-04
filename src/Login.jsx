import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // Add login logic here
  };

  return (
    <div className="login-container">
      <div className="image-container">
        <img style={{width:'210px',height:'580px'}} src="https://storage.googleapis.com/a1aa/image/2588ea77-81c1-4f7a-2247-9dceadfbd0e7.jpg" alt="Construction Site" />
      </div>
     

      <div className="form-container">
        <div className="logo">
          <img src="https://storage.googleapis.com/a1aa/image/e8b3452e-9af4-49c7-5599-c82dfad9be04.jpg" alt="Mineral Management System Logo" />
        </div>
        <h2>Mineral Management System</h2>
        <form onSubmit={handleLogin}>
          <label>
            Username *
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
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
          <button type="button" className="login-button">Login</button>
          <button type="button" className="other-payment-button">Other Payment</button>
        </form>
        <p className="register-link">
          Not Registered?  <a className='reg' href="/Register">Register</a>
          <a className='forgot' href="Forgot password">forgot password</a>
          
        </p>
      </div>
    </div>
  );
};

export default Login;