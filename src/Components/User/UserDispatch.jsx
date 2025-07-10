import React, { useState, useEffect } from 'react';
import './UserDispatch.css';
import { adminAddQuaeyByIdAPI, updateAdminData } from '../../Server/allAPI';
import { useLocation, useNavigate } from 'react-router-dom';

function UserDispatch() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = location.state || {};
console.log(userData);

  const getCurrentDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const local = new Date(now.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
  };

  // Define initial form state
  const initialFormState = {
    deliveredTo: '',
    vehicleNo: '',
    vehicleType: '',
    totalDistance: '',
    travellingDate: getCurrentDateTime(),
    requiredTime: '',
    quantity: '',
    driverName: '',
    driverPhoneNo: '',
    driverLicenseNo: '',
    destinationAddress: '',
    driverSignature: '',
    via: ''
  };

  const [autoDate, setAutoDate] = useState(true);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(initialFormState);

  // Fetch user-specific data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        if (!userData?.id) {
          alert('User data not available. Please login again.');
          navigate('/');
          return;
        }

        // Fetch user-specific data using their id
        const response = await adminAddQuaeyByIdAPI(userData.id);
        console.log(response.data);
        
        if (response.data) {
          setUserDetails(response.data);
        } else {
          throw new Error('No user data received');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        alert('Failed to load user data');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userData, navigate]);

  // Auto-update date time
  useEffect(() => {
    if (autoDate) {
      const interval = setInterval(() => {
        setFormData(prev => ({
          ...prev,
          travellingDate: getCurrentDateTime()
        }));
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [autoDate]);

  // Calculate required time based on distance
  useEffect(() => {
    if (formData.totalDistance) {
      const distance = parseFloat(formData.totalDistance);
      if (!isNaN(distance)) {
        const now = new Date(formData.travellingDate);
        const travelTimeInHours = distance / 50;
        const travelTimeInMs = travelTimeInHours * 60 * 60 * 1000;
        const requiredDateTime = new Date(now.getTime() + travelTimeInMs);
        const offset = requiredDateTime.getTimezoneOffset();
        const local = new Date(requiredDateTime.getTime() - offset * 60000);
        const formattedTime = local.toISOString().slice(0, 16);
        setFormData(prev => ({
          ...prev,
          requiredTime: formattedTime
        }));
      }
    }
  }, [formData.totalDistance, formData.travellingDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!userDetails) {
    alert('User data is not loaded yet. Please wait...');
    return;
  }

  try {
    setLoading(true);

    // Get current and end serial/dispatch numbers with their original string format
    const currentSerialStr = userDetails.SerialNo || '0';
    const currentDispatchStr = userDetails.dispatchNo || '0';
    const serialEndStr = userDetails.SerialEndNo || '0';

    // Parse as numbers for comparison
    const currentSerial = parseInt(currentSerialStr, 10);
    const currentDispatch = parseInt(currentDispatchStr, 10);
    const serialEnd = parseInt(serialEndStr, 10);

    // Check if serial number has reached the limit
    if (serialEnd > 0 && currentSerial >= serialEnd) {
      alert('Serial number range has been exhausted. Please contact admin.');
      return;
    }

    // Compute new values (respecting the serial end limit)
    const newSerialNum = serialEnd > 0 ? Math.min(currentSerial + 1, serialEnd) : currentSerial + 1;
    const newDispatchNum = currentDispatch + 1;

    // Function to format numbers with leading zeros like original
    const formatWithLeadingZeros = (originalStr, newNum) => {
      return String(newNum).padStart(originalStr.length, '0');
    };

    // Merge form data with user info and updated serials
    const dispatchData = {
      ...formData,
      userId: userData.id,
      lesseeId: userData.lesseeId,
      SerialNo: formatWithLeadingZeros(currentSerialStr, newSerialNum),
      dispatchNo: formatWithLeadingZeros(currentDispatchStr, newDispatchNum),
      createdAt: new Date().toISOString()
    };

    console.log(userDetails, "userDetails");
    console.log(dispatchData, "dispatchData");

    const response = await updateAdminData(dispatchData);
    console.log(response.data, "queryDataAPI");

    if (response.status === 200 || response.status === 201) {
      alert("Dispatch submitted successfully");

      // Update local state with new serials (formatted with leading zeros)
      const updatedUserDetails = {
        ...userDetails,
        SerialNo: formatWithLeadingZeros(currentSerialStr, newSerialNum),
        dispatchNo: formatWithLeadingZeros(currentDispatchStr, newDispatchNum)
      };
      setUserDetails(updatedUserDetails);

      navigate('/userview', {
        state: {
          userData: response.data
        }
      });

      // Reset form
      setFormData(initialFormState);
    } else {
      throw new Error('Submission failed');
    }
  } catch (error) {
    console.error('Error submitting dispatch:', error);
    alert(error.response?.data?.message || 'Failed to submit dispatch data');
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return <div className="dispatch-container">Loading data...</div>;
  }
    if (loading) {
    return <div className="dispatch-container">Loading data...</div>;
  }

  return (
    <div className="dispatch-container">
      <h2>Dispatch For</h2>

     
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Dispatch form fields */}
          <div>
            <label>Delivered To:</label>
            <input type="text" name="deliveredTo" value={formData.deliveredTo} onChange={handleChange} className="input" />
          </div>

          <div>
            <label>Vehicle No:</label>
            <input type="text" name="vehicleNo" value={formData.vehicleNo} onChange={handleChange} className="input" />
          </div>

          <div>
            <label>Vehicle Type:</label>
            <input type="text" name="vehicleType" value={formData.vehicleType} onChange={handleChange} className="input" />
          </div>

          <div>
            <label>Total Distance (Kms):</label>
            <input
              type="text"
              name="totalDistance"
              value={formData.totalDistance}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div  style={{marginLeft:'90px'}}>
            <label>Traveling Date & Time:</label>
            <div className="flex items-center gap-2 mb-1">
              <label>
                <input
                  type="radio"
                  name="mode"
                  checked={autoDate}
                  onChange={() => setAutoDate(true)}
                /> Auto
              </label>
              <label>
                <input
                  type="radio"
                  name="mode"
                  checked={!autoDate}
                  onChange={() => setAutoDate(false)}
                /> Manual
              </label>
            </div>
            <input
              type="datetime-local"
              name="travellingDate"
              value={formData.travellingDate}
              onChange={handleChange}
              readOnly={autoDate}
              className="input"
            />
          </div>

          <div style={{marginTop:'-110px',marginLeft:'20px'}}>
            <label >Required Date & Time:</label>
            <input
              type="datetime-local"
              name="requiredTime"
              value={formData.requiredTime}
              readOnly
              className="input"
            />
          </div>

          <div style={{marginLeft:'-250px',marginTop:'10px'}} >
            <label >Quantity (in MT):</label>
            <input type="text" name="quantity" value={formData.quantity} onChange={handleChange} className="input" />
          </div>

          <div style={{marginTop:'10px',marginLeft:'30px'}}>
            <label>Driver Name:</label>
            <input type="text" name="driverName" value={formData.driverName} onChange={handleChange} className="input" />
          </div>

          <div style={{marginTop:'10px'}}>
            <label>Driver Phone No:</label>
            <input type="text" name="driverPhoneNo" value={formData.driverPhoneNo} onChange={handleChange} className="input" />
          </div>

          <div>
            <label>Driver Licence No:</label>
            <input type="text" name="driverLicenseNo" value={formData.driverLicenseNo} onChange={handleChange} className="input" />
          </div>

          <div>
            <label>Destination Address:</label>
            <input type="text" name="destinationAddress" value={formData.destinationAddress} onChange={handleChange} className="input" />
          </div>

          <div>
            <label>Driver Signature:</label>
            <input type="text" name="driverSignature" value={formData.driverSignature} onChange={handleChange} className="input" />
          </div>

          <div>
            <label>Via:</label>
            <input type="text" name="via" value={formData.via} onChange={handleChange} className="input" />
          </div>
        </div>

  <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>      </form>
    </div>
  );
}

export default UserDispatch;