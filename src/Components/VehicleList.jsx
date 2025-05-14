import React, { useEffect, useState } from 'react';
import { getVehiclesAPI, deleteVehicleAPI } from '../Server/allAPI';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './VehicleList.css';

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await getVehiclesAPI();
      if (response.data?.data && Array.isArray(response.data.data)) {
        setVehicles(response.data.data);
        localStorage.setItem('vehicles', JSON.stringify(response.data.data));
      } else {
        setError('Invalid response format from server.');
      }
    } catch (err) {
      setError('Failed to fetch vehicles.');
      console.error('API error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (vehicleId) => {
    // Navigate to view/edit page using the vehicle's ID
    navigate(`/view/${vehicleId}`);
  };

  const handleDelete = async (vehicleId) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        const response = await deleteVehicleAPI(vehicleId);
        
        if (response.data?.success) {
          toast.success('Vehicle deleted successfully');
          
          // Optimistic update
          setVehicles(prev => prev.filter(v => v._id !== vehicleId));
          
          // Update localStorage if needed
          const localVehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
          localStorage.setItem('vehicles', 
            JSON.stringify(localVehicles.filter(v => v._id !== vehicleId))
          );
        } else {
          toast.error(response.data?.error || 'Failed to delete vehicle');
        }
      } catch (err) {
        toast.error('Network error - failed to delete vehicle');
        console.error('Delete error:', err);
        
        // Refetch to ensure consistency
        fetchVehicles();
      }
    }
  };  
  if (loading) return <p>Loading vehicles...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="vehicle-list-container">
      <h2>Vehicle List</h2>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-start', gap: '10px' }}>
  <button className="btn-add" onClick={() => navigate('/add')}>Add New Vehicle</button>
  <button className="btn-refresh" onClick={fetchVehicles}>Refresh</button>
</div>

      <div className="table-responsive">
        {vehicles.length === 0 ? (
          <p>No vehicles available.</p>
        ) : (
          <table className="vehicle-table">
            <thead>
              <tr>
                <th>Reg. No.</th>
                <th>Owner</th>
                <th>District</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle._id}>
                  <td>{vehicle.registrationNumber}</td>
                  <td>{vehicle.ownerName}</td>
                  <td>{vehicle.district}</td>
                  <td>{vehicle.vehicleType}</td>
                  <td>{vehicle.currentStatus}</td>
                  <td className="action-buttons">
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(vehicle._id)}
                    >
                      Edit
                    </button>
                                        <button className="btn-print" onClick={() => window.print()}>Print</button>

                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(vehicle._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default VehicleList;
