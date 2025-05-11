import React, { useState } from 'react';
import './VehicleManagement.css';
import { vehiclesAPI, vehiclesupdateAPI,  } from '../Server/allAPI';
import { useNavigate, useLocation } from 'react-router-dom';

const VehicleManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editingVehicle = location.state?.vehicle;

  const [userVehicle, setUserVehicle] = useState(() => editingVehicle || {
    registrationNumber: '',
    ownerName: '',
    district: '',
    vehicleRCNumber: '',
    vehicleFCNumber: '',
    insuranceNumber: '',
    vehicleWeight: '',
    vehicleImage: null,
    currentStatus: '',
    vehicleType: '',
    ownerContact: '',
    chassisNumber: '',
    rcValidTill: '',
    fcValidTill: '',
    insuranceValidTill: '',
    maximumCapacity: '',
    numberPlateImage: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setUserVehicle({ ...userVehicle, [name]: files[0] });
    } else {
      setUserVehicle({ ...userVehicle, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    for (const key in userVehicle) {
      formData.append(key, userVehicle[key]);
    }

    try {
      if (editingVehicle) {
        await vehiclesupdateAPI(editingVehicle._id, formData);
        alert("Vehicle updated successfully!");
      } else {
        await vehiclesAPI(formData);
        alert("Vehicle added successfully!");
      }

      navigate('/vehicle');
    } catch (err) {
      console.error("Error submitting vehicle:", err);
      alert("Failed to submit vehicle");
    }
  };

  return (
    <div className="container">
      <h2>{editingVehicle ? 'Edit Vehicle' : 'Vehicle Management'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="left-column">
            <label>Registration Number</label>
            <input type="text" name="registrationNumber" value={userVehicle.registrationNumber} onChange={handleChange} disabled={!!editingVehicle} />

            <label>Owner Name</label>
            <input type="text" name="ownerName" value={userVehicle.ownerName} onChange={handleChange} />

            <label>District</label>
            <select name="district" value={userVehicle.district} onChange={handleChange}>
              <option value="">-- Select --</option>
              <option value="Erode">Erode</option>
              <option value="Kallakurichi">Kallakurichi</option>
              <option value="Kancheepuram">Kancheepuram</option>
              <option value="Kanyakumari">Kanyakumari</option>
              <option value="Karur">Karur</option>
            </select>

            <label>Vehicle RC Number</label>
            <input type="text" name="vehicleRCNumber" value={userVehicle.vehicleRCNumber} onChange={handleChange} />

            <label>Vehicle FC Number</label>
            <input type="text" name="vehicleFCNumber" value={userVehicle.vehicleFCNumber} onChange={handleChange} />

            <label>Insurance Number</label>
            <input type="text" name="insuranceNumber" value={userVehicle.insuranceNumber} onChange={handleChange} />

            <label>Vehicle Weight (Empty)</label>
            <input type="number" name="vehicleWeight" value={userVehicle.vehicleWeight} onChange={handleChange} />

            <h2 className='h2'>Attachments</h2>

            <label>Vehicle Image (JPG/JPEG)</label>
            <input type="file" name="vehicleImage" accept=".jpg,.jpeg" onChange={handleChange} />

            <label>Current Status</label>
            <select name="currentStatus" value={userVehicle.currentStatus} onChange={handleChange}>
              <option value="">-- Select --</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="right-column">
            <label>Vehicle Type</label>
            <select name="vehicleType" value={userVehicle.vehicleType} onChange={handleChange}>
              <option value="">-- Select --</option>
              <option value="Tractor">Tractor</option>
              <option value="Lorry">Lorry</option>
              <option value="Tarus 9">Tarus 9</option>
              <option value="Tipper">Tipper</option>
              <option value="Tarus 12">Tarus 12</option>
            </select>

            <label>Owner Contact</label>
            <input type="text" name="ownerContact" value={userVehicle.ownerContact} onChange={handleChange} />

            <label>Chassis Number</label>
            <input type="text" name="chassisNumber" value={userVehicle.chassisNumber} onChange={handleChange} />

            <label>RC Valid Till</label>
            <input type="date" name="rcValidTill" value={userVehicle.rcValidTill} onChange={handleChange} />

            <label>FC Valid Till</label>
            <input type="date" name="fcValidTill" value={userVehicle.fcValidTill} onChange={handleChange} />

            <label>Insurance Valid Till</label>
            <input type="date" name="insuranceValidTill" value={userVehicle.insuranceValidTill} onChange={handleChange} />

            <label>Maximum Capacity</label>
            <input type="text" name="maximumCapacity" value={userVehicle.maximumCapacity} onChange={handleChange} />

            <label>Number Plate Image (JPG/JPEG)</label>
            <input type="file" name="numberPlateImage" accept=".jpg,.jpeg" onChange={handleChange} />
          </div>
        </div>

        <div className="button-container">
          <button type="submit" className="submit-button">{editingVehicle ? 'Update' : 'Submit'}</button>
          <button type="button" className="cancel-button" onClick={() => navigate('/vehicle-list')}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default VehicleManagement;
