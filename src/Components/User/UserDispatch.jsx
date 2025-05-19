import React, { useState, useEffect } from 'react';
import './UserDispatch.css';
import { employeeAddtAPI } from '../../Server/allAPI';
import { useNavigate } from 'react-router-dom';

function UserDispatch() {
  const navigate = useNavigate();

  const getCurrentDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const local = new Date(now.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16); // For datetime-local
  };

  const [autoDate, setAutoDate] = useState(true);

  const [formData, setFormData] = useState({
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

  // Update travellingDate every 1 minute when auto is on
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


  // Automatically calculate Required Time based on totalDistance

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
        const formattedTime = local.toISOString().slice(0, 16); // datetime-local format
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

    try {
      const existingData = JSON.parse(localStorage.getItem('dispatchData')) || [];
      const updatedData = [...existingData, formData];

      localStorage.setItem('dispatchData', JSON.stringify(updatedData));
 const response = await employeeAddtAPI(formData);
      console.log(response);
      
      alert('Dispatch data submitted successfully!');
      navigate('/userview');

      // Reset form
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
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Failed to submit dispatch data');
    }
  };

  return (
    <div className="dispatch-container">
      <h2>Dispatch For</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
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

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default UserDispatch;