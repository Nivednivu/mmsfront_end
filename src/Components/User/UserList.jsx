import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserList.css'; // Optional: Add CSS for table/form layout

function UserList() {
  const [latestDispatch, setLatestDispatch] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('dispatchData')) || [];
    if (storedData.length > 0) {
      const lastEntry = storedData[storedData.length - 1];
      setLatestDispatch(lastEntry);
      setEditedData(lastEntry);
    }
  }, []);

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditToggle = () => setIsEditing(true);

  const handleSave = () => {
    const storedData = JSON.parse(localStorage.getItem('dispatchData')) || [];
    if (storedData.length > 0) {
      storedData[storedData.length - 1] = editedData;
      localStorage.setItem('dispatchData', JSON.stringify(storedData));
      setLatestDispatch(editedData);
      setIsEditing(false);
    }
  };

  const handleView = () => {
    localStorage.setItem('viewDispatch', JSON.stringify(latestDispatch));
    navigate('/userview');
  };

  const renderCell = (field) => {
    return isEditing ? (
      <input
        type="text"
        value={editedData[field]}
        onChange={(e) => handleInputChange(field, e.target.value)}
      />
    ) : (
      latestDispatch[field]
    );
  };

  return (
    <div className="user-list-container">
      <h2>Latest Dispatch Entry</h2>
      {!latestDispatch ? (
        <p>No dispatch record found.</p>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="dispatch-table">
              <thead>
                <tr>
                  <th>Delivered To</th>
                  <th>Vehicle No</th>
                  <th>Vehicle Type</th>
                  <th>Total Distance (km)</th>
                  <th>Travel Date</th>
                  <th>Required Time</th>
                  <th>Quantity (MT)</th>
                  <th>Driver Name</th>
                  <th>Phone No</th>
                  <th>License No</th>
                  <th>Address</th>
                  <th>Signature</th>
                  <th>Via</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {[
                    'deliveredTo',
                    'vehicleNo',
                    'vehicleType',
                    'totalDistance',
                    'travellingDate',
                    'requiredTime',
                    'quantity',
                    'driverName',
                    'driverPhoneNo',
                    'driverLicenseNo',
                    'destinationAddress'
                  ].map(field => (
                    <td key={field}>{renderCell(field)}</td>
                  ))}
                  <td>
                    {latestDispatch.driverSignature ? (
                      <img
                        src={latestDispatch.driverSignature}
                        alt="Signature"
                        style={{ height: '50px' }}
                      />
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>{renderCell('via')}</td>
                </tr>
              </tbody>
            </table>  
          </div>

          <div className="button-group">
            {!isEditing ? (
              <button onClick={handleEditToggle}>Edit</button>
            ) : (
              <button onClick={handleSave}>Save</button>
            )}
            <button onClick={handleView}>View</button>
          </div>
        </>
      )}
    </div>
  );
}

export default UserList;
