import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import './Login.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { loginAdmin } from './Server/allAPI';

const Login = () => {
  const location = useLocation();
  const { registeredUser } = location.state || {};

  const [showPassword, setShowPassword] = useState(false);
  const [loginUser, setLoginUser] = useState({ 
    lesseeId: registeredUser?.lesseeId || '', 
    password: '' 
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  const { lesseeId, password } = loginUser;

  if (!lesseeId || !password) {
    alert("Please enter both username and password");
    return;
  }

  setIsLoading(true);
  try {
    const result = await loginAdmin({ lesseeId, password });

    if (result.status === 200) {
      alert("Login successful!");
      // Pass the user data in navigation state
      navigate('/userdasboard', { 
        state: { 
          userData: result.data.user 
        } 
      });
    } else if (result.status === 403) {
      alert("Please complete your registration first");
      navigate('/register', { state: { newUserData: { _id: result.data.userId } } });
    } else {
      alert("Invalid credentials. Please try again.");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert(error.response?.data?.message || "Login failed. Please try again.");
  } finally {
    setIsLoading(false);
  }
};
  return (
    <div className="login-container">
      <div className="form-container">
        <h2>Mineral Management System</h2>
        <form onSubmit={handleLogin}>
          <label>
            Username (Lessee ID) *
            <input
              type="text"
              value={loginUser.lesseeId}
              onChange={(e) => setLoginUser({ ...loginUser, lesseeId: e.target.value })}
              required
              disabled={isLoading}
            />
          </label>
          <label>
            Password *
            <div className="password-wrapper left-icon">
              <span style={{marginRight:'2px'}}
                className="password-toggle-icon"
                onClick={() => !isLoading && setShowPassword(!showPassword)}
              >
                {/* {showPassword ? <FaEyeSlash /> : <FaEye />} */}
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={loginUser.password}
                onChange={(e) => setLoginUser({ ...loginUser, password: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>
          </label>
          <button 
            type="submit" 
            className="login-button" 
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="register-link">
          Not Registered? <Link className="reg" to="/register">Register</Link>
          <Link className="admin" to="/admin">Admin</Link>
          <Link className="forgot" to="/forgotp">Forgot Password</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
