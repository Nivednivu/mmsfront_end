import React, { useState } from 'react';
import './UserDispatch.css'
function UserDispatch() {
const [formData, setFormData] = useState({
  deliveredTo: '',
  vehicleNo: '',
  vehicleType: '',
  totalDistance: '',
  travellingDate: '',        
  requiredTime: '',
  quantity: '',
  driverName: '',
  driverPhoneNo: '',        
  driverLicenseNo: '',    
  destinationAddress: '',
  driverSignature: '',
  via: ''
});

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dispatch Data:', formData);
    // You can send this data to the backend using fetch or axios
  };

  return (
<div className="dispatch-container">
  <h2>Dispatch Form</h2>

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
        <input type="number" name="totalDistance" value={formData.totalDistance} onChange={handleChange} className="input" />
      </div>

      <div>
        <label>Traveling Date:</label>
        <input type="date" name="travellingDate" value={formData.travellingDate} onChange={handleChange} className="input" />
      </div>

      <div>
        <label>Required Time:</label>
        <input type="time" name="requiredTime" value={formData.requiredTime} onChange={handleChange} className="input" />
      </div>

      <div>
        <label>Quantity (in MT):</label>
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
