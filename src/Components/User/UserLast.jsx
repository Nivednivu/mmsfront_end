import React, { useEffect, useState } from 'react';
import { querySingleGetAPI } from '../../Server/allAPI';
import { useParams } from 'react-router-dom';
import './UserLast.css'; // Import the CSS file

function UserLast() {
  const { id } = useParams();
  const [lastEmployee, setLastEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLastEmployee = async () => {
      try {
        setLoading(true);
        const response = await querySingleGetAPI(id);
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
  }, [id]);

  if (loading) return <div className="loading-container">Loading...</div>;
  if (error) return <div className="error-container">{error}</div>;
  if (!lastEmployee) return <div className="no-data-container">No data found</div>;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="user-last-container">
      <h2 className="section-title">Dispatch & User Details</h2>

      <div className="section">
        <h3>User / Lessee Details</h3>
        <div className="details-grid">
          <div className="detail-row"><span>Lessee Name:</span><span>{lastEmployee.lesseeName || 'N/A'}</span></div>
          <div className="detail-row"><span>Mine Code:</span><span>{lastEmployee.minecode || 'N/A'}</span></div>
          <div className="detail-row"><span>Lessee Address:</span><span>{lastEmployee.lesseeNameAddress || 'N/A'}</span></div>
          <div className="detail-row"><span>Lessee ID:</span><span>{lastEmployee.lesseeId || 'N/A'}</span></div>
          <div className="detail-row"><span>Authorized Person:</span><span>{lastEmployee.lesseeAuthPersonName || 'N/A'}</span></div>
        </div>
      </div>

      <div className="section">
        <h3>Permit & Mineral Details</h3>
        <div className="details-grid">
          <div className="detail-row"><span>Bulk Permit No:</span><span>{lastEmployee.bulkPermitNo || 'N/A'}</span></div>
          <div className="detail-row"><span>Mineral Name:</span><span>{lastEmployee.mineralName || 'N/A'}</span></div>
          <div className="detail-row"><span>HSN Code:</span><span>{lastEmployee.hsnCode || 'N/A'}</span></div>
          <div className="detail-row"><span>Classification:</span><span>{lastEmployee.classification || 'N/A'}</span></div>
          <div className="detail-row"><span>Lease Period:</span><span>{lastEmployee.leasePeriod || 'N/A'}</span></div>
        </div>
      </div>

      <div className="section">
        <h3>Location Details</h3>
        <div className="details-grid">
          <div className="detail-row"><span>District:</span><span>{lastEmployee.districtName || 'N/A'}</span></div>
          <div className="detail-row"><span>Taluk:</span><span>{lastEmployee.Taluk || 'N/A'}</span></div>
          <div className="detail-row"><span>Village:</span><span>{lastEmployee.village || 'N/A'}</span></div>
          <div className="detail-row"><span>SF No & Extent:</span><span>{lastEmployee.sfNoExtent || 'N/A'}</span></div>
        </div>
      </div>

      <div className="section">
        <h3>Dispatch & Vehicle Details</h3>
        <div className="details-grid">
          <div className="detail-row"><span>Dispatch No:</span><span>{`DISP${lastEmployee.dispatchNo}` || 'N/A'}</span></div>
          <div className="detail-row"><span>Serial No:</span><span>{`TN00${lastEmployee.SerialNo}` || 'N/A'}</span></div>
          <div className="detail-row"><span>Delivered To:</span><span>{lastEmployee.deliveredTo || 'N/A'}</span></div>
          <div className="detail-row"><span>Destination:</span><span>{lastEmployee.destinationAddress || 'N/A'}</span></div>
          <div className="detail-row"><span>Vehicle No:</span><span>{lastEmployee.vehicleNo || 'N/A'}</span></div>
          <div className="detail-row"><span>Vehicle Type:</span><span>{lastEmployee.vehicleType || 'N/A'}</span></div>
          <div className="detail-row"><span>Via:</span><span>{lastEmployee.via || 'N/A'}</span></div>
          <div className="detail-row"><span>Quantity:</span><span>{lastEmployee.quantity || 'N/A'}</span></div>
          <div className="detail-row"><span>Total Distance:</span><span>{lastEmployee.totalDistance || 'N/A'}</span></div>
        </div>
      </div>

      <div className="section">
        <h3>Driver Details</h3>
        <div className="details-grid">
          <div className="detail-row"><span>Driver Name:</span><span>{lastEmployee.driverName || 'N/A'}</span></div>
          <div className="detail-row"><span>Phone No:</span><span>{lastEmployee.driverPhoneNo || 'N/A'}</span></div>
          <div className="detail-row"><span>License No:</span><span>{lastEmployee.driverLicenseNo || 'N/A'}</span></div>
        </div>
      </div>

      <div className="section">
        <h3>Timing Information</h3>
        <div className="details-grid">
          <div className="detail-row"><span>Required Time:</span><span>{formatDate(lastEmployee.requiredTime)}</span></div>
          <div className="detail-row"><span>Travelling Date:</span><span>{formatDate(lastEmployee.travellingDate)}</span></div>
        </div>
      </div>
    </div>
  );
}

export default UserLast;
