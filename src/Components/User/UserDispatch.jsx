import React, { useState, useEffect } from 'react';
import './UserDispatch.css';
import { adminAddQuaeyByIdAPI } from '../../Server/allAPI';
import { useLocation, useNavigate } from 'react-router-dom';

function UserDispatch() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = location.state || {};

  const getCurrentDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    return new Date(now.getTime() - offset * 60000).toISOString().slice(0, 16);
  };

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

  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        if (!userData?.id) {
          alert('User data not available. Please login again.');
          navigate('/');
          return;
        }

        const response = await adminAddQuaeyByIdAPI(userData.id);
        if (response.data) {
          // Format numbers with leading zeros
          const formattedData = {
            ...response.data,
            SerialNo: response.data.SerialNo ? String(response.data.SerialNo): '000001',
            dispatchNo: response.data.dispatchNo ? String(response.data.dispatchNo) : '000001'
          };
          setUserDetails(formattedData);
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

  // ... [keep other useEffect hooks the same]

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
    
    // Special handling for travellingDate in manual mode
    if (name === 'travellingDate') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        // Clear requiredTime only if we're in manual mode
        requiredTime: !autoDate ? '' : prev.requiredTime
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
console.log(formData.travellingDate);


const deliveredTo = formData.deliveredTo
const vehicleNo = formData.vehicleNo
const vehicleType = formData.vehicleType
const totalDistance =formData.totalDistance
const quantity = formData.quantity
const driverName = formData.driverName
const driverPhoneNo = formData.driverPhoneNo
const driverLicenseNo = formData.driverLicenseNo
const driverSignature = formData.driverSignature
const via = formData.via
const travellingDate = formData.travellingDate
const requiredTime = formData.requiredTime
const destinationAddress= formData.destinationAddress


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userDetails) {
      alert('User data is not loaded yet. Please wait...');
      return;
    }

    try {
      setLoading(true);

      // Get current numbers with leading zeros
      const currentSerialStr = userDetails.SerialNo || '000001';
      const currentDispatchStr = userDetails.dispatchNo || '000001';
      const serialEndStr = userDetails.SerialEndNo || '999999';

      // Parse as numbers for comparison
      const currentSerial = parseInt(currentSerialStr, 10);
      const currentDispatch = parseInt(currentDispatchStr, 10);
      const serialEnd = parseInt(serialEndStr, 10);

      if (serialEnd > 0 && currentSerial >= serialEnd) {
        alert('Serial number range exhausted. Contact admin.');
        return;
      }

      // Calculate next numbers with leading zeros
      const nextSerial = String(currentSerial + 1).padStart(currentSerialStr.length, '0');
      const nextDispatch = String(currentDispatch + 1).padStart(currentDispatchStr.length, '0');
console.log(nextSerial,"seral in userdispatch page");

      // Prepare data for preview (not saving to DB yet)
      const previewData = {
        ...formData,
        ...userDetails,
        userId: userData.id,
        lesseeId: userData.lesseeId,
        SerialNo: nextSerial,
        dispatchNo: nextDispatch,
        createdAt: new Date().toISOString(),
        status: 'pending' // Mark as pending until printed
      };
console.log(previewData,"preview data in userdispatch page");

      // Navigate to view page with preview data
// In handleSubmit function, modify the navigate call:
navigate('/userview', {
  state: {
    previewData: previewData,
    deliveredTo:deliveredTo,
    vehicleNo:vehicleNo,
    vehicleType:vehicleType,
    totalDistance:totalDistance,
    quantity:quantity,
    driverName:driverName,
    driverPhoneNo:driverPhoneNo,
    driverLicenseNo:driverLicenseNo,
    driverSignature:driverSignature,
    via:via,
    travellingDate :travellingDate,
    requiredTime:requiredTime,
    destinationAddress:destinationAddress,
    userData: {  // Ensure consistent structure
      data: {
        _id: userData.id,  // Map to expected structure
        ...userData
      }
    }
  }
});
    } catch (error) {
      console.error('Error preparing dispatch:', error);
      alert('Failed to prepare dispatch');
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