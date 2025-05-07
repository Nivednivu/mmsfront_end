import React, { useState, useEffect } from 'react';
import './DispatchList.css';
import { useNavigate } from 'react-router-dom';

const DispatchList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadVehicles = () => {
      setLoading(true);
      try {
        const storedVehicles = JSON.parse(localStorage.getItem('vehicles') || '[]')
        
        // Clean up data - remove empty file objects and ensure required fields
        const cleanedVehicles = storedVehicles.map(vehicle => ({
          ...vehicle,
          vehicleImage: vehicle.vehicleImage && Object.keys(vehicle.vehicleImage).length ? vehicle.vehicleImage : null,
          numberPlateImage: vehicle.numberPlateImage && Object.keys(vehicle.numberPlateImage).length ? vehicle.numberPlateImage : null
        }));
        
        setVehicles(cleanedVehicles);
      } catch (error) {
        console.error("Error loading vehicles:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadVehicles();
  }, []);

  const handleAddNew = () => {
    navigate('/vehicle-manag');
  };

  const handleRefresh = () => {
    const storedVehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
    setVehicles(storedVehicles);
    console.log(storedVehicles);
    
  };

  const handleEdit = (vehicle) => {
    navigate(`/vehicle-manag`, { 
      state: { 
        editMode: true, 
        vehicleData: vehicle 
      } 
    });
  };

  const handleDelete = (registrationNumber) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      const updatedVehicles = vehicles.filter(
        vehicle => vehicle.registrationNumber !== registrationNumber
      );
      localStorage.setItem('vehicles', JSON.stringify(updatedVehicles));
      setVehicles(updatedVehicles);
    }
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    if (!vehicle.registrationNumber) return false; // Skip invalid entries
    
    return (
      vehicle.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vehicle.ownerName && vehicle.ownerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (vehicle.district && vehicle.district.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="dispatch-container">
      <h3>Dispatch Slip</h3>
      
      <div className="dispatch-controls">
        <input
          type="text"
          placeholder="Search by Reg No, Owner or District"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="button-group">
          <button className="btn btn-add" onClick={handleAddNew}>Add New Vehicle</button>
          <button className="btn btn-refresh" onClick={handleRefresh}>
            Refresh List
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-message">Loading vehicles...</div>
      ) : filteredVehicles.length === 0 ? (
        <div className="no-data-message">
          {vehicles.length === 0 
            ? "No vehicles found. Click 'Add New Vehicle' to get started."
            : "No vehicles match your search criteria."}
        </div>
      ) : (
        <>
          <div className="vehicle-count">
            Showing {filteredVehicles.length} of {vehicles.length} vehicles
          </div>
          <table className="dispatch-table">
            <thead>
              <tr>
                <th>Registration No</th>
                <th>Owner Name</th>
                <th>Vehicle Type</th>
                <th>District</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
<tbody>
  {filteredVehicles.map((v) => (
    <tr key={`${v.registrationNumber}-${v.district}`}>
      <td>{v.registrationNumber || 'N/A'}</td>
      <td>{v.ownerName || 'N/A'}</td>
      <td>{v.vehicleType || 'N/A'}</td>
      <td>{v.district || 'N/A'}</td>
      <td>
        <span className={`status-badge ${v.currentStatus === 'active' ? 'active' : 'inactive'}`}>
          {v.currentStatus || 'unknown'}
        </span>
      </td>
      <td>
        <button className="btn-edit" onClick={() => handleEdit(v)}>Edit</button>
        <button className="btn-delete" onClick={() => handleDelete(v.registrationNumber)}>Delete</button>
        <button className="btn-print" onClick={() => window.print()}>Print</button>
      </td>
    </tr>
  ))}
</tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default DispatchList;