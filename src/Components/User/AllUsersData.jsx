import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserList.css';
import { deleteQueryAPI, queryGetAPI } from '../../Server/allAPI';

function AllUsersData() {
  const [queries, setQueries] = useState([]);
  const [filteredQueries, setFilteredQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lesseeIdFilter, setLesseeIdFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllQueries();
  }, []);

  useEffect(() => {
    // Filter by lesseeId only
    let results = queries;
    
    if (lesseeIdFilter) {
      results = results.filter(query => 
        query.lesseeId && query.lesseeId.toLowerCase().includes(lesseeIdFilter.toLowerCase())
      );
    }
    
    setFilteredQueries(results);
  }, [lesseeIdFilter, queries]);

  const fetchAllQueries = async () => {
    try {
      setLoading(true);
      const response = await queryGetAPI();
      
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

  const handleRefresh = () => {
    fetchAllQueries();
    setLesseeIdFilter(''); // Reset filter on refresh
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="user-list-container">
      <h2>All Dispatch Entries</h2>

      <div className="count-display">
        <div className="total-count">
          Total Records: <strong>{queries.length}</strong>
        </div>
        {lesseeIdFilter && (
          <div className="filtered-count">
            Filtered Records: <strong>{filteredQueries.length}</strong>
          </div>
        )}
      </div>

      <div className="header-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Filter by Lessee ID"
            value={lesseeIdFilter}
            onChange={(e) => setLesseeIdFilter(e.target.value)}
          />
        </div>

        <div className="button-group">
          <button onClick={handleRefresh} className="action-btn refresh-btn">
            Refresh
          </button>
        </div>
      </div>

      {filteredQueries.length === 0 ? (
        <p>No dispatch records found{lesseeIdFilter ? ` for Lessee ID: "${lesseeIdFilter}"` : ''}.</p>
      ) : (
        <div className="table-wrapper">
          <table className="dispatch-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Lessee ID</th>
                <th>Permit Number</th>
                <th>Dispatch Number</th>
                <th>MineCode</th>
                <th>Security Paper Number</th>
                <th>Mineral</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredQueries.map((query, index) => (
                <tr key={query._id}>
                  <td>{index + 1}</td>
                  <td>{query.lesseeId || 'N/A'}</td>
                  <td>{query.bulkPermitNo || 'N/A'}</td>
                  <td>{`DISP${query.dispatchNo}`}</td>
                  <td>{query.minecode || 'N/A'}</td>
                  <td>{`TN00${query.SerialNo}`}</td>
                  <td>{query.mineralName || 'N/A'}</td>
                  <td className='action-butt'>
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

export default AllUsersData;