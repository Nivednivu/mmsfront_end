import React, { useEffect, useState } from 'react';
import './QueryAdminList.css';
import { adminAddQuaeyAllAPI, adminDeleteQueryByIdAPI } from '../../Server/allAPI';
import { useNavigate } from 'react-router-dom';

function AdminQueryList() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAddQuaeyAllAPI();
      
      // Handle different response structures
      const data = response.data?.data || response.data || [];
      
      if (!Array.isArray(data)) {
        throw new Error("Invalid data format received from server");
      }
      
      setEntries(data);
    } catch (err) {
      console.error("Failed to fetch entries:", err);
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        const response = await adminDeleteQueryByIdAPI(id);
        if (response.status === 200 || response.message === "Query deleted successfully") {
          setSuccessMessage("Entry deleted successfully");
          fetchEntries();
          setTimeout(() => setSuccessMessage(null), 3000);
        } else {
          throw new Error(response.message || "Failed to delete entry");
        }
      } catch (err) {
        console.error("Failed to delete entry:", err);
        setError(err.message || "Failed to delete entry. Please try again.");
      }
    }
  };

  const handleView = (id) => {
    navigate(`/adminqview/${id}`);
  };

  const filteredEntries = entries.filter(entry => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (entry.hsnCode?.toLowerCase().includes(searchLower)) ||
      (entry.lesseeId?.toLowerCase().includes(searchLower)) ||
      (entry.minecode?.toLowerCase().includes(searchLower)) ||
      (entry.SerialNo?.toLowerCase().includes(searchLower)) ||
      (entry.districtName?.toLowerCase().includes(searchLower))
    );
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading data...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="admin-list-container">
      <h2>Admin Query List</h2>
      
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by HSN, Lessee ID, Minecode..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredEntries.length === 0 ? (
        <div className="no-entries">
          {entries.length === 0 ? "No entries found" : "No matching entries found"}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="entries-table">
            <thead>
              <tr>
                <th>HSN Code</th>
                <th>Lessee ID</th>
                <th>Mine Code</th>
                <th>Lessee Name</th>
                <th>Serial No</th>
                <th>dispatchNO</th>
                <th>District</th>
                <th>Taluk</th>
                <th>Village</th>
                <th>Mineral</th>
                <th>Bulk Permit No</th>
                <th>Within TN</th>
                <th>Signature</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry) => (
                <tr key={entry._id}>
                  <td>{entry.hsnCode || '-'}</td>
                  <td>{entry.lesseeId || '-'}</td>
                  <td>{entry.minecode || '-'}</td>
                  <td>{entry.lesseeName || '-'}</td>
                  <td>{entry.SerialNo || '-'}</td>
                  <td>{entry.dispatchNo || '-'}</td>
                  <td>{entry.districtName || '-'}</td>
                  <td>{entry.Taluk || '-'}</td>
                  <td>{entry.village || '-'}</td>
                  <td>{entry.mineralName || '-'}</td>
                  <td>{entry.bulkPermitNo || '-'}</td>
                  <td>{entry.withinTamilNadu || '-'}</td>
                  <td>
                    {entry.signature ? (
                      <img 
                        style={{width:'60px',height:'40px'}}
                        src={entry.signature} 
                        alt="Signature" 
                        className="signature-thumbnail"
                      />
                    ) : (
                      <span className="no-signature">No signature</span>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                   
                      <button 
                        onClick={() => handleDelete(entry._id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminQueryList;
