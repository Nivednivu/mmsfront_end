import React, { useState } from 'react';
import './UserDashbord.css';
import { FaFileAlt, FaTruck } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

function UserDashboard() {
  const navigate = useNavigate();
  const [showEpermit, setShowEpermit] = useState(false);
  const [showUserList, setShowUserList] = useState(false);

  const handleEpermitClick = (e) => {
    e.preventDefault();
    setShowEpermit(!showEpermit);
    setShowUserList(false);
    navigate('/userdispatch'); // Navigate to UserList page
  };

  const handleDispatchClick = (e) => {
    e.preventDefault();
    setShowUserList(!showUserList);
    setShowEpermit(false);
    navigate('/userlist'); // Navigate to UserDispatch page
  };


  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>User Dashboard</h2>
        <h5>Navigation</h5>
        <ul>
          <li onClick={handleEpermitClick}>
            <FaFileAlt className="icon-blue" />
            <span>e-Permit</span>
          </li>
          <li onClick={handleDispatchClick}>
            <FaTruck className="icon-green" />
            <span>Dispatch</span>
          </li>
                    <Link to={'/userview'}
           style={{  color: '#333',  textDecoration: 'none',}}>
          <li>  User View</li>
          </Link>

        </ul>
      </aside>

      {/* Main content can be dynamically rendered using <Outlet /> if needed */}
    </div>
  );
}

export default UserDashboard;
