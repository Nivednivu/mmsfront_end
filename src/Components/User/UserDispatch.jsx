import React, { useState, useEffect } from 'react';
import './UserDispatch.css';
import { adminAddQuaeyLastAPI, queryDataAPI } from '../../Server/allAPI';
import { useNavigate } from 'react-router-dom';

function UserDispatch() {
  const navigate = useNavigate();

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
  const [queryData, setQueryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(initialFormState);

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const adminResponse = await adminAddQuaeyLastAPI();
        console.log('Admin Query Data:', adminResponse.data.data);
        
        if (adminResponse.data.data) {
          setQueryData(adminResponse.data.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to load required data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  if (!queryData) {
    alert('Required data is not loaded yet. Please wait...');
    return;
  }

  try {
    // Get current numbers and ranges
    const currentSerial = parseInt(queryData.SerialNo || '0', 10);
    const serialStart = parseInt(queryData.SerialStartNo || '0', 10);
    const serialEnd = parseInt(queryData.SerialEndNo || '0', 10);
    const currentDispatch = parseInt(queryData.dispatchNo || '0', 10);

    // Calculate new serial number (loop back to start if at end)
    let newSerial;
    if (serialEnd > 0 && currentSerial >= serialEnd) {
      // Reached end - reset to start
      newSerial = serialStart;
      alert('Serial number range completed. Resetting to start number.');
    } else {
      // Normal increment
      newSerial = currentSerial + 1;
    }

    // Always increment dispatch number
    const newDispatch = currentDispatch + 1;

    // Merge form and query data
    const mergedData = {
      ...queryData,
      ...formData,
      SerialNo: newSerial,
      dispatchNo: newDispatch,
      createdAt: new Date().toISOString()
    };

    // Submit the merged data
    const response = await queryDataAPI(mergedData);

    if (response.status === 200 || response.status === 201) {
      alert("Successfully Submitted");
      navigate('/userview');

      // Reset form after successful submit
      setFormData({
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
      });

      // Update local queryData with new numbers
      setQueryData(prev => ({
        ...prev,
        SerialNo: newSerial,
        dispatchNo: newDispatch
      }));

    } else {
      throw new Error('Submission failed');
    }
  } catch (error) {
    console.error('Error submitting data:', error);
    alert('Failed to submit dispatch data');
  }
};

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
              type="number"
              name="totalDistance"
              value={formData.totalDistance}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
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

          <div>
            <label style={{marginTop:'70px'}}>Required Date & Time:</label>
            <input
              type="datetime-local"
              name="requiredTime"
              value={formData.requiredTime}
              readOnly
              className="input"
            />
          </div>

          <div>
            <label style={{marginTop:'70px',marginRight:'10px'}}>Quantity (in MT):</label>
            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="input" />
          </div>

          <div>
            <label>Driver Name:</label>
            <input type="text" name="driverName" value={formData.driverName} onChange={handleChange} className="input" />
          </div>

          <div>
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

        <button type="submit" disabled={!queryData}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default UserDispatch;