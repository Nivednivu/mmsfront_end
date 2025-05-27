import React, { useEffect, useState } from 'react';
import { getLastEmployeeAPI } from '../../Server/allAPI'; // Adjust import path as needed

function UserLast() {
  const [lastEmployee, setLastEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLastEmployee = async () => {
      try {
        setLoading(true);
        const response = await getLastEmployeeAPI();
        
        if (!response.data) {
          setError('No employee data found');
          return;
        }

        setLastEmployee(response.data);
      } catch (err) {
        console.error('Error fetching employee data:', err);
        setError('Failed to load employee data');
      } finally {
        setLoading(false);
      }
    };

    fetchLastEmployee();
  }, []);

  if (loading) {
    return <div className="loading-container">Loading employee data...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (!lastEmployee) {
    return <div className="no-data-container">No employee data available</div>;
  }

  // Format dates for better readability
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };
console.log(lastEmployee);

  return (
    <div className="user-last-container">
      <h2>Last Dispatch Details</h2>
      <div className="details-grid">
        
        <div className="detail-row">
          <span className="detail-label">Created At:</span>
          <span className="detail-value">{formatDate(lastEmployee.createdAt)}</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">Delivered To:</span>
          <span className="detail-value">{lastEmployee.deliveredTo || 'N/A'}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Destination Address:</span>
          <span className="detail-value">{lastEmployee.destinationAddress || 'N/A'}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Driver License No:</span>
          <span className="detail-value">{lastEmployee.driverLicenseNo || 'N/A'}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Driver Name:</span>
          <span className="detail-value">{lastEmployee.driverName || 'N/A'}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Driver Phone No:</span>
          <span className="detail-value">{lastEmployee.driverPhoneNo || 'N/A'}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Quantity:</span>
          <span className="detail-value">{lastEmployee.quantity || 'N/A'}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Required Time:</span>
          <span className="detail-value">{formatDate(lastEmployee.requiredTime)}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Total Distance:</span>
          <span className="detail-value">{lastEmployee.totalDistance || 'N/A'}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Travelling Date:</span>
          <span className="detail-value">{formatDate(lastEmployee.travellingDate)}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Vehicle No:</span>
          <span className="detail-value">{lastEmployee.vehicleNo || 'N/A'}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Vehicle Type:</span>
          <span className="detail-value">{lastEmployee.vehicleType || 'N/A'}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Via:</span>
          <span className="detail-value">{lastEmployee.via || 'N/A'}</span>
        </div>

        {lastEmployee.driverSignature && (
          <div className="detail-row">
            <span className="detail-label">Driver Signature:</span>
            <img 
              src={lastEmployee.driverSignature} 
              alt="Driver Signature" 
              className="signature-image"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default UserLast;