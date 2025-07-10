// Sidebar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './sidebar.css';
import VehicleManagement from './Components/VehicleManagement';
import VehicleList from './Components/VehicleList';

const Sidebar = () => {
  const navigate = useNavigate()
  const [showVehicleManagement, setShowVehicleManagement] = useState(false);
  const [showDispatchList, setShowDispatchList] = useState(false); // <-- Step 2: State

  const handleVehicleManagementClick = (e) => {
    e.preventDefault();
    setShowVehicleManagement(!showVehicleManagement);
    setShowDispatchList(false); // Hide Dispatch List if Vehicle Management is shown
  };

  // const handleDispatchListClick = (e) => {
  //   e.preventDefault();
  //   setShowDispatchList(!showDispatchList);
  //   setShowVehicleManagement(false); // Hide Vehicle Management if Dispatch List is shown
  // };


  return (
    <div className="app-container">
      <div className="sidebar">
        <h2>MIMAS-MM</h2>
        <ul>
          <h5>MIMAS</h5>
          
          <Link to={'/queryentry'}
           style={{  color: '#333',  textDecoration: 'none',}}>
          <li> Dashboard</li>
          </Link>

                    <Link to={'/adminlist'}   style={{  color: '#333',  textDecoration: 'none',}}>
            <li>Admin List</li>

          </Link>


          <Link to={'/adminlast'}   style={{  color: '#333',  textDecoration: 'none',}}>
            <li>Admin Last Data</li>

          </Link>


          
          <li>                    <Link to={'/alluser'}
           style={{  color: '#333',  textDecoration: 'none',}}>
          All Users
          </Link>
</li>
          <li>In Process</li>
          <li>Grievances</li>
          <li>Mine Transfer</li>
          <h5>E-PERMIT</h5>
          <li><a href="/query">E-Permit</a> </li>
          <li>Bulk Permit</li>
          <li>Sub Users</li>
                    <Link to={'/adminlist'}
           style={{  color: '#333',  textDecoration: 'none',}}>
          <li>  Dispatch List</li>
          </Link>

          {/* <li>
            <a href="#" onClick={handleDispatchListClick}>
              Dispatch List
            </a>
          </li> */}
          <li>Vehicle In and Out List</li>
          <li>Weighbridge List</li>
          <li>Storage License</li>
          <li>Cost of Minerals/Others</li>
          <li>Request Security Papers</li>
          <li>Security Paper Summary</li>
          <h5>VTS</h5>
          <li>GPS Device Management</li>
          <li>
            <a href="/vehicle-manag" onClick={handleVehicleManagementClick}>
              Vehicle Management
            </a>
          </li>
        </ul>
      </div>
      {/* <div className={`main-content ${(showVehicleManagement || showDispatchList) ? 'show' : ''}`}>
        {showVehicleManagement && <VehicleManagement />}
        {showDispatchList && <VehicleList />}
      </div> */}
    </div>
  );
};

export default Sidebar;
