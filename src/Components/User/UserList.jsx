import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './UserList.css';
import { deleteQueryAPI, queryGetAPI } from '../../Server/allAPI';

function UserList() {
  const location = useLocation();
  const { lesseeId } = location.state || {};
  console.log("Current lesseeId:", lesseeId);
  
  const [queries, setQueries] = useState([]);
  const [filteredQueries, setFilteredQueries] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllQueries();
  }, []);

  useEffect(() => {
    // First filter by lesseeId, then by search term
    let results = queries;
    
    // Filter by lesseeId if it exists
    if (lesseeId) {
      results = results.filter(query => 
        query.lesseeId === lesseeId
      );
    }
    
    // Then apply search filter if search term exists
    if (searchTerm) {
      results = results.filter(query => 
        (query.SerialNo && query.SerialNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (query.dispatchNo && query.dispatchNo.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredQueries(results);
  }, [searchTerm, queries, lesseeId]);

  const fetchAllQueries = async () => {
    try {
      setLoading(true);
      const response = await queryGetAPI();
      console.log("API Response:", response);
      
      if (response.data && Array.isArray(response.data)) {
        setQueries(response.data);
      } else {
        throw new Error("No data received or data is not in expected format");
      }
    } catch (err) {
      console.error("Failed to fetch queries:", err);
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (id, field, value) => {
    setEditedData(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        [field]: value,
      }
    }));
  };

  const handleView = (query) => {
    navigate(`/lastuser/${query._id}`, { state: { lesseeId } });
  };

  const handleAddNew = () => {
    navigate('/userdispatch', { state: { lesseeId } });
  };

  const handleRefresh = () => {
    fetchAllQueries();
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete this record?")) {
        await deleteQueryAPI(id);
        fetchAllQueries();
      }
    } catch (err) {
      console.error("Failed to delete query:", err);
      setError("Failed to delete record. Please try again.");
    }
  };

  const renderCell = (query, field) => {
    if (isEditing === query._id) {
      return (
        <input
          type="text"
          value={editedData[query._id]?.[field] || ''}
          onChange={(e) => handleInputChange(query._id, field, e.target.value)}
        />
      );
    }
    return query[field] || 'N/A';
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="user-list-container">
      <h2>All Dispatch Entries {lesseeId ? `for Lessee ID: ${lesseeId}` : ''}</h2>

      <div className="header-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="button-group">
          <button onClick={handleAddNew} className="action-btn add-btn">
            Add 
          </button>
          <button onClick={handleRefresh} className="action-btn refresh-btn">
            Refresh
          </button>
        </div>
      </div>

      {filteredQueries.length === 0 ? (
        <p>No dispatch records found{lesseeId ? ` for Lessee ID: ${lesseeId}` : ''}.</p>
      ) : (
        <div className="table-wrapper">
          <table className="dispatch-table">
            <thead>
              <tr>
                <th>Permit Number</th>
                <th>Dispatch Number</th>
                <th>MineCode</th>
                <th>Security Paper Number</th>
                <th>Mineral</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredQueries.map(query => (
                <tr key={query._id}>
                  <td>{renderCell(query, 'bulkPermitNo')}</td>
                  <td>{`DISP${query.dispatchNo}`}</td>
                  <td>{renderCell(query, 'minecode')}</td>
                  <td>{`TN00${query.SerialNo}`}</td>
                  <td>{renderCell(query, 'mineralName')}</td>
                  <td className='action-butt'>
                    <button onClick={() => handleView(query)}>View</button>
                    <button
                      onClick={() => handleDelete(query._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
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

export default UserList;
