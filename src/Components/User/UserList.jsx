import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserList.css';
import { getLastEmployeeAPI } from '../../Server/allAPI';

function UserList() {
  const [latestDispatch, setLatestDispatch] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestEntry = async () => {
      try {
        const response = await getLastEmployeeAPI();
        console.log("API Response:", response);
        
        // The response.data contains the single dispatch object directly
        if (response.data && typeof response.data === 'object') {
          setLatestDispatch(response.data);
          setEditedData(response.data);
        } else {
          throw new Error("No data received");
        }
      } catch (err) {
        console.error("Failed to fetch latest entry:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestEntry();
  }, []);

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditToggle = () => setIsEditing(true);

  const handleSave = async () => {
    try {
      // You'll need to implement an update API endpoint
      // const response = await updateDispatchAPI(editedData._id, editedData);
      // Then refresh the data
      // fetchLatestEntry();
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update entry:", err);
      setError("Failed to update entry. Please try again.");
    }
  };

  const handleView = () => {
    navigate('/userview', { state: { dispatchData: latestDispatch } });
  };

  const renderCell = (field) => {
    if (!latestDispatch) return 'N/A';
    
    return isEditing ? (
      <input
        type="text"
        value={editedData[field] || ''}
        onChange={(e) => handleInputChange(field, e.target.value)}
      />
    ) : (
      latestDispatch[field] || 'N/A'
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

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
                  <td>{renderCell('deliveredTo')}</td>
                  <td>{renderCell('vehicleNo')}</td>
                  <td>{renderCell('vehicleType')}</td>
                  <td>{renderCell('totalDistance')}</td>
                  <td>{renderCell('travellingDate')}</td>
                  <td>{renderCell('requiredTime')}</td>
                  <td>{renderCell('quantity')}</td>
                  <td>{renderCell('driverName')}</td>
                  <td>{renderCell('driverPhoneNo')}</td>
                  <td>{renderCell('driverLicenseNo')}</td>
                  <td>{renderCell('destinationAddress')}</td>
                  <td>
                    {latestDispatch.driverSignature ? (
                      <img 
                        src={latestDispatch.driverSignature} 
                        alt="Signature" 
                        width="100" 
                        height="20" 
                      />
                    ) : (
                      <span>No image</span>
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