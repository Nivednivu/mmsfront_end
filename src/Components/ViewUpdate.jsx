import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVehiclesAPI, vehiclesupdateAPI } from '../Server/allAPI';

function ViewUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [vehicleImageFile, setVehicleImageFile] = useState(null);
  const [numberPlateImageFile, setNumberPlateImageFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch vehicle data when component mounts
  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        setLoading(true);
        
        // Try API first
        const response = await getVehiclesAPI(id);
        
        // Handle API response (could be single object or array)
        let vehicleData = null;
        
        if (Array.isArray(response.data?.data)) {
          // If API returns array, find matching vehicle
          vehicleData = response.data.data.find(v => v._id === id);
        } else if (response.data?.data) {
          // If API returns single object
          vehicleData = response.data.data;
        }
        
        if (vehicleData) {
          setVehicle(vehicleData);
        } else {
          // Fallback to localStorage
          const localVehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
          const foundVehicle = localVehicles.find(v => v._id === id);
          
          if (foundVehicle) {
            setVehicle(foundVehicle);
          } else {
            setMessage('Vehicle not found');
          }
        }
      } catch (err) {
        console.error('Error fetching vehicle:', err);
        setMessage('Error loading vehicle data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchVehicleData();
  }, [id]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicle(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      if (name === 'vehicleImage') setVehicleImageFile(files[0]);
      if (name === 'numberPlateImage') setNumberPlateImageFile(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vehicle) return;

    try {
      const formData = new FormData();
      
      // Add all vehicle data to formData
      Object.entries(vehicle).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      // Add files if they exist
      if (vehicleImageFile) formData.append('vehicleImage', vehicleImageFile);
      if (numberPlateImageFile) formData.append('numberPlateImage', numberPlateImageFile);

      const response = await vehiclesupdateAPI(id, formData);
      
      if (response.status === 200) {
        setMessage('✅ Vehicle updated successfully!');
        
        // Update localStorage
        const allVehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
        const updatedVehicles = allVehicles.map(v => 
          v._id === id ? response.data.data : v
        );
        localStorage.setItem('vehicles', JSON.stringify(updatedVehicles));
        
        // Navigate back after 2 seconds
        setTimeout(() => navigate('/vehicle'), 2000);
      } else {
        setMessage('❌ Failed to update vehicle');
      }
    } catch (error) {
      console.error('Update error:', error);
      setMessage('❌ Error updating vehicle');
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading vehicle data...</div>;
  }

  if (!vehicle) {
    return <div className="p-4 text-center text-red-500">{message || 'Vehicle not found'}</div>;
  }


  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Update Vehicle Details</h2>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Basic Information Column */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
          
          <div>
            <label className="block mb-1">Registration Number:</label>
            <input
              name="registrationNumber"
              value={vehicle.registrationNumber || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block mb-1">Owner Name:</label>
            <input
              name="ownerName"
              value={vehicle.ownerName || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block mb-1">Vehicle Type:</label>
            <input
              name="vehicleType"
              value={vehicle.vehicleType || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block mb-1">Chassis Number:</label>
            <input
              name="chassisNumber"
              value={vehicle.chassisNumber || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        {/* Document Information Column */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Document Information</h3>
          
          <div>
            <label className="block mb-1">RC Number:</label>
            <input
              name="vehicleRCNumber"
              value={vehicle.vehicleRCNumber || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block mb-1">RC Valid Till:</label>
            <input
              type="date"
              name="rcValidTill"
              value={vehicle.rcValidTill?.split('T')[0] || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block mb-1">FC Number:</label>
            <input
              name="vehicleFCNumber"
              value={vehicle.vehicleFCNumber || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block mb-1">FC Valid Till:</label>
            <input
              type="date"
              name="fcValidTill"
              value={vehicle.fcValidTill?.split('T')[0] || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Additional Information Column */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Additional Information</h3>
          
          <div>
            <label className="block mb-1">Owner Contact:</label>
            <input
              name="ownerContact"
              value={vehicle.ownerContact || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block mb-1">District:</label>
            <input
              name="district"
              value={vehicle.district || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block mb-1">Status:</label>
            <select
              name="currentStatus"
              value={vehicle.currentStatus || 'active'}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-1">Vehicle Image:</label>
            <input
              type="file"
              name="vehicleImage"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
            />
            {vehicle.vehicleImage && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Current Image:</p>
                <img 
                  src={vehicle.vehicleImage} 
                  alt="Vehicle" 
                  className="h-20 object-contain"
                />
              </div>
            )}
          </div>
          
          <div>
            <label className="block mb-1">Number Plate Image:</label>
            <input
              type="file"
              name="numberPlateImage"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
            />
            {vehicle.numberPlateImage && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Current Image:</p>
                <img 
                  src={vehicle.numberPlateImage} 
                  alt="Number Plate" 
                  className="h-20 object-contain"
                />
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="md:col-span-3 flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={() => navigate('/vehicle')}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            Update Vehicle
          </button>
        </div>

        {/* Status Message */}
        {message && (
          <div className={`md:col-span-3 p-3 rounded ${
            message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

export default ViewUpdate;